import networkx as nx
import matplotlib.pyplot as plt
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score, davies_bouldin_score
from sklearn.preprocessing import StandardScaler
import numpy as np
import pandas as pd
import community as community_louvain  

# Load Data Set
def load_dataset(file_path):
 
    # Load the dataset as a DataFrame
    data = pd.read_csv(file_path, sep="\t", comment="#", names=["source", "target"])
    
    data = data[data["source"] != data["target"]]
    data.drop_duplicates(inplace=True)
    
    #return a directed graph
    graph = nx.DiGraph()
    graph.add_edges_from(zip(data["source"], data["target"]))
    return graph

# Compute graph metrics
def compute_metrics(graph):
 
    metrics = {
        "density": nx.density(graph),
        "avg_clustering": nx.average_clustering(graph.to_undirected()),
        "transitivity": nx.transitivity(graph),
        "reciprocity": nx.reciprocity(graph),
    }
    if nx.is_strongly_connected(graph):
        metrics["avg_path_length"] = nx.average_shortest_path_length(graph)
    else:
        largest_component = max(nx.strongly_connected_components(graph), key=len)
        subgraph = graph.subgraph(largest_component)
        metrics["avg_path_length"] = nx.average_shortest_path_length(subgraph)

    return metrics

# Detect communities using Louvain method (instead of k-means)
def detect_communities(graph):

    undirected_graph = graph.to_undirected()  # Convert directed graph to undirected for community detection
    partition = community_louvain.best_partition(undirected_graph)
    clusters = list(partition.values())  # Get the cluster assignment for each node
    return clusters

# Visualize the graph with clusters
def visualize_graph(graph, clusters, metrics):

    pos = nx.spring_layout(graph, seed=42)
    node_sizes = [500 for _ in graph.nodes]
    color_palette = ["#1f78b4", "#33a02c", "#e31a1c", "#ff7f00"]  # Updated color scheme
    node_colors = [color_palette[cluster % len(color_palette)] for cluster in clusters]

    # Set up the figure
    plt.figure(figsize=(12, 8))  # Adjusted to make the window smaller
    nx.draw_networkx_nodes(graph, pos, node_size=node_sizes, node_color=node_colors, edgecolors="black")
    nx.draw_networkx_edges(graph, pos, alpha=0.6, edge_color="gray", arrowstyle="->", arrowsize=12)
    nx.draw_networkx_labels(graph, pos, font_size=8, font_color="black")

    # Display metrics on the visualization (top-left corner)
    graph_stats = (
        f"Graph Statistics:\n"
        f"Nodes: {graph.number_of_nodes()}\n"
        f"Edges: {graph.number_of_edges()}\n"
        f"Density: {metrics['density']:.4f}\n"
        f"Avg Clustering: {metrics['avg_clustering']:.4f}\n"
        f"Transitivity: {metrics['transitivity']:.4f}\n"
        f"Reciprocity: {metrics['reciprocity']:.4f}\n"
        f"Avg Path Length: {metrics.get('avg_path_length', 'Not Fully Connected'):.4f}\n"
        f"Clusters: {len(set(clusters))}"  # Display the number of clusters
    )
    plt.text(
        -0.05,
        1.05,
        graph_stats,
        fontsize=10,
        transform=plt.gca().transAxes,
        verticalalignment="top",
        bbox=dict(boxstyle="round", facecolor="white", alpha=0.8),
    )

    plt.title("Graph Clustering Visualization", fontsize=14, fontweight="bold")
    plt.axis("off")
    plt.show()


def main():
    # Define file path
    file_path = "smallerdata.txt"
    
    # Generate a synthetic graph and write it to a file
    #graph = nx.gnp_random_graph(100, 0.05, directed=True)
    #nx.write_edgelist(graph, file_path, delimiter="\t", data=False)

    # Read the graph back from the file
    graph = load_dataset(file_path)

    # Display metrics
    metrics = compute_metrics(graph)

    # Detect communities (clusters) using Louvain method
    clusters = detect_communities(graph)

    # Visualize graph with clusters
    visualize_graph(graph, clusters, metrics)

if _name_ == "_main_":
    main()