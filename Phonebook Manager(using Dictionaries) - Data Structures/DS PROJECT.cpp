#include <iostream>
#include <math.h>
#include <cmath>
#include <ctime>
#include <cstdlib>
#include <conio.h>
#include <limits>
#include <stdexcept>

using namespace std;

void delay(float number_of_seconds)
{
	int milli_seconds = 1000 * number_of_seconds;
	clock_t start_time = clock();
	while (clock() < start_time + milli_seconds)  ;
}

bool isNumber(string s)
{
	for(int i=0; i<s.size(); ++i) {
		if((s[i]<'0' || s[i]>'9') && s[i]!='+')
			return false;
	}
	return true;
}

class Contact
{
	public:
		string first_name;
		string last_name;
		string email;
		string address;
		string phone_number;


		Contact() 
		{
			first_name = "";
			last_name = "";
			email = "";
			address = "";
			phone_number = "";
		}

		Contact(string num) 
		{
			first_name = "";
			last_name = "";
			email = "";
			address = "";
			phone_number = num;
		}


		Contact(string firstname, string lastname, string sample_number, string email, string address)
		{
			first_name = firstname;
			last_name = lastname;
			this->email = email;
			this->address = address;
			this->phone_number = sample_number;
		}


		Contact(const Contact* demo) 
		{
			this->first_name = demo->first_name;
			this->last_name = demo->last_name;
			this->email = demo->email;
			this->address = demo->address;
			this->phone_number=demo->phone_number;
		}


		void Print_Contact_Details() 
		{
			delay(0.2);
			cout << "\tCONTACT DETAILS" << endl;
			cout << "\t---------------" << endl;
			cout << "\nFIRST NAME : " << first_name << endl;
			cout << "LAST NAME: " << last_name << endl;
			cout << "CONTACT NUMBER : "<<phone_number<< endl;
			cout << "EMAIL ADDRESS : " << email << endl;
			cout << "ADDRESS : " << address << endl;
			cout << "\n" << endl;
		}

};

class Registry
{
	public:
		int table_size;
		Contact** number_contact_table;
		string **NameNum;


		Registry() 
		{
			table_size = 0;
			number_contact_table = NULL;
		}


		Registry(int size) 
		{
			table_size = size;
			number_contact_table = new Contact *[table_size] {};
			NameNum= new string*[table_size];
			for(int i=0; i<table_size; ++i) {
				NameNum[i]=new string[2] {""};
			}
		}

		void addNameNum(string num, string name) 
		{
			int k=calculate_key(name);
			if(NameNum[k][0]=="") {
				NameNum[k][0]=name;
				NameNum[k][1]=num;
				return;
			} 
			else 
			{
				int i = 0;
				while (i < table_size) 
				{
					if (NameNum[(k + i) % table_size][0] == "") 
					{
						NameNum[(k + i) % table_size][0] = name;
						NameNum[(k + i) % table_size][1] = num;
						break;
					}
					i++;
				}
			}
		}

		string getNum(string name) 
		{
			int k=calculate_key(name);
			if(NameNum[k][0]=="") 
			{
			} 
			else if(NameNum[k][0]==name)
			{
				return NameNum[k][1];
			}
			else {
				int i = 0;
				while (i < table_size)
				 {
					if (NameNum[(k + i) % table_size][0] == name) 
					{
						return NameNum[(k + i) % table_size][1];
					}
					i++;
				}
			}
			return "";
		}

		int calculate_key(string number)
		 {
			int key = 0;
			//long long sum = 0;
			for (int i = 0; i < number.size(); i++) 
			{
				key = key + (number[i]-48)* pow(2, i);
				//cout << key << endl;
			}
			key = key % table_size;
			return key;
		}


		void add_to_Registry(Contact *contact)
		 {
			int contact_key = calculate_key(contact->phone_number);
			if (number_contact_table[contact_key] == NULL) 
			{
				number_contact_table[contact_key] = contact;
			}
			else
			  {
				int i = 0;
				while (i < table_size) 
				{
					if (number_contact_table[(contact_key + i) % table_size] == NULL) 
					{
						number_contact_table[(contact_key + i) % table_size] = contact;
						break;
					}
					i++;
				}
			}
			addNameNum(contact->phone_number,contact->first_name+" "+contact->last_name);
		}

		void remove_from_Registry(string num,int flag) 
		{
			if(!isNumber(num))
			{
				remove_from_NameNum(num,"",1);
				return;
			}
			int contact_key =search_Index(num);
			//delete number_contact_table[(contact_key)];
			if (contact_key==-1)
			{
				cout << "NO CONTACT SUCH EXISTS" << endl;
			} 
			else
			{
				if(flag)
				{
				remove_from_NameNum(number_contact_table[(contact_key)]->first_name+" "+number_contact_table[(contact_key)]->last_name,number_contact_table[(contact_key)]->phone_number,0);
				number_contact_table[(contact_key)]=NULL;
				}
				cout << "\nCONTACT DELETED" << endl;
			}
		}

		void remove_from_NameNum(string name, string num, int flag)
		{
			if(flag) 
			{
				Contact *c[10];
				int i=0;
				int searchKey=calculate_key(name);
				while(NameNum[searchKey][0]!="") 
				{
					if(name=="")
					{
						return;
					}
					else if(NameNum[searchKey][0]==name)
					{
						c[i]=search_contact_number(NameNum[searchKey][1]);
						cout << endl;
						cout<<i+1<<":\n";
						c[i]->Print_Contact_Details();
						++i;
						searchKey=(searchKey+1)%table_size;
					}
				}
				int ind;
				if(c[0]!=NULL) 
				{
					cout<<"Enter Contact index to Delete : ";
					cin>>ind;
					num=c[ind-1]->phone_number;
				}
			}
			if(num!="")
			{
				int k=calculate_key(name);
				if(NameNum[k][0]==name && num==NameNum[k][1]) 
				{
					if(flag)
						remove_from_Registry(NameNum[k][1],0);
					NameNum[k][0] = "";
					NameNum[k][1] = "";
					return;
				} 
				else 
				{
					int i = 0;
					while (i < table_size) 
					{
						if (NameNum[(k + i) % table_size][0] == name && num==NameNum[(k + i) % table_size][1]) 
						{
							if(flag)
							{
								remove_from_Registry(NameNum[(k + i) % table_size][1],0);
							}
							NameNum[(k + i) % table_size][0] = "";
							NameNum[(k + i) % table_size][1] = "";
							return;
						}
						i++;
					}
				}
			}
			cout<<"CONTACT NOT FOUND";
		}
 		void print_all_contacts() 
		{
			for (int i = 0; i < table_size; i++) 
			{
				if (number_contact_table[i] != NULL) 
				{
					number_contact_table[i]->Print_Contact_Details();
				}
			}
			cout << endl;
			cout << "TO PROCEED PRESS ENTER" << endl;
			getche();
		}

		void search_contact_number() 
		{
			string num;
			string s;
			cout << "ENTER CREDENTIALS TO SEARCH : ";
			cin.ignore();
			getline(cin,s);
			if (isNumber(s)) 
			{
				num = s;
			} 
			else 
			{
				searchName(s);
				return;
			}
			int searchkey = calculate_key(num);
			while(searchkey<table_size) 
			{
				if (number_contact_table[searchkey] != NULL && calculate_key(number_contact_table[searchkey]->phone_number) == searchkey) 
				{
					cout << "CONTACT FOUND -- PRINTING DETAILS\n" << endl;
					number_contact_table[searchkey]->Print_Contact_Details();
				} 
				else if (number_contact_table[searchkey] == NULL) 
				{
					return;
				}
				searchkey=(searchkey+1)%table_size;
			}
			if (searchkey == calculate_key(num)+1) 
			{
				cout << "CONTACT NOT FOUND" << endl;
			}
		}


		Contact* search_contact_number(string number) 
		{
			int searchkey = calculate_key(number);
			if (number_contact_table[searchkey] != NULL && calculate_key(number_contact_table[searchkey]->phone_number) == searchkey) 
			{
				return number_contact_table[searchkey];
			} 
			else 
			{
				return NULL;
			}
		}

		void searchName(string name) 
		{
			Contact *c[10];
			int i=0;
			int searchKey=calculate_key(name);
			while(NameNum[searchKey][0]!="") 
			{
				if(name=="")
				{
					return;
				}
				else if(NameNum[searchKey][0]==name) 
				{
					c[i]=search_contact_number(NameNum[searchKey][1]);
					cout << "\t                         CONTACT" << endl;
					cout << "\t                         -------" << endl;
					c[i]->Print_Contact_Details();
					++i;
					searchKey=(searchKey+1)%table_size;
				}
			}
			cout << "\n\nTO PROCEED PRESS ENTER" << endl;
			getche();
		}
		int search_Index(string number) 
		{
			int searchkey = calculate_key(number);
			while (number_contact_table[searchkey] != NULL) 
			{
				if (number_contact_table[searchkey]->phone_number==number) 
				{
					return searchkey;
				}
				searchkey = (searchkey+1) % table_size;
			}
			return -1;
		}

};

struct t {
	int hours;
	int minute;
	int seconds;
};

class Log
{
	public:
		Contact contact;
		time_t call_time;
		t time_taken;
		Log* next;

		Log() 
		{
			next = NULL;
			call_time = time(NULL);
			time_taken.hours=0;
			time_taken.minute=0;
			time_taken.seconds=0;
		}

		Log(Contact democontact,time_t ct,int h,int m,int s)
		{
			contact = democontact;
			call_time = ct;
			time_taken.hours=h;
			time_taken.minute=m;
			time_taken.seconds=s;
			next = NULL;
		}

		Log(Contact democontact) 
		{
			contact = democontact;
			call_time = NULL;
			time_taken.hours=0;
			time_taken.minute=0;
			time_taken.seconds=0;
			next = NULL;
		}

};



class Call_Log
{
	public:
		Log* head;
		Log* tail;
		Call_Log() 
		{
			head = NULL;
			tail = NULL;
		}
		void Add_to_Log(Contact C,time_t ct,int h,int m,int s) 
		{
			Log* L = new Log(C,ct,h,m,s);
			if (head == NULL) 
			{
				head = L;
				tail = L;
				//    L->contact->Print_Contact_Details();
			} 
			else 
			{
				tail->next = L;
				tail = L;
				//   L->contact->Print_Contact_Details();
			}
		}

		void print_log() 
		{
			system("cls");
			delay(0.4);
			Log* temp = head;
			cout << "\nPRINTING CALL LOG" << endl;
			cout << "-----------------\n" << endl;
			if (head == NULL) 
			{
				cout << "\nCALL LOG IS EMPTY\n" << endl;
			}
			while (temp != NULL) 
			{
				temp->contact.Print_Contact_Details();
				cout<<"Call Date & Time: ";
				time_t now = time(NULL);
				tm *localTime = localtime(&temp->call_time);
				char timeBuffer[80];
				strftime(timeBuffer, sizeof(timeBuffer), "%Y-%m-%d , %H:%M:%S", localTime);
				cout << timeBuffer << endl;
				cout<<"DURATION : ";
				if(temp->time_taken.hours>0)
				{
					cout<< temp->time_taken.hours << " hours " << temp->time_taken.minute << " minutes " << temp->time_taken.seconds << " seconds." << endl;
				}
				else if(temp->time_taken.minute>0)
				{
					cout<< temp->time_taken.minute << " minutes " << temp->time_taken.seconds << " seconds." << endl;
				}
				else
				{
					cout<< temp->time_taken.seconds << " seconds." << endl;
				}
				temp = temp->next;
			}
			cout << "\nEND OF CALL LOG" << endl;
			cout << "---------------" << endl;
			cout <<"\nTO PROCEED PRESS ENTER" << endl;
			getche();
		}

		void changes(string str, int choice, string number) 
		{
			Log* temp = head;
			while(temp!=NULL) 
			{
				while (temp!=NULL && temp->contact.phone_number != number) 
				{
					temp = temp->next;
				}
				if (temp!=NULL) 
				{
					switch (choice) 
					{
						case 1:
							temp->contact.first_name = str;
							break;
						case 2:
							temp->contact.last_name = str;
							break;
						case 4:
							temp->contact.email = str;
							break;
						case 5:
							temp->contact.address = str;
							break;
						case 3:
							temp->contact.first_name = "";
							temp->contact.last_name = "";
							temp->contact.email = "";
							temp->contact.address = "";
							break;
					}
					temp = temp->next;
				}
			}
		}
};


int Edit_Contact_details(Registry *r,Contact *c,Call_Log *inc, Call_Log *out)
{
	int choice = 4;
	cout << "---EDIT CONTACT---" << endl;
	c->Print_Contact_Details();
	cout << endl;
	cout << "Editing Options :" << endl;
	cout << "1 : Edit First Name" << endl;
	cout << "2 : Edit Last Name" << endl;
	cout << "3 : Edit Contact Number" << endl;
	cout << "4 : Edit Email Address" << endl;
	cout << "5 : Edit Address" << endl;
	cout << "6 : Go Back" << endl;
	cout << "Enter Corresponding Number to Edit Details : ";
	cin >> choice;
	string a;
	string n;
	switch (choice) 
	{
		case 1:
			a=c->first_name+" "+c->last_name;
			cout << "Enter New First Name : ";
			cin >> c->first_name;
			cout << "First Name Updated"<< endl;
			r->remove_from_NameNum(a,c->phone_number,0);
			r->addNameNum(c->phone_number,c->first_name+" "+c->last_name);
			out->changes(c->first_name,choice,c->phone_number);
			inc->changes(c->first_name,choice,c->phone_number);
			break;
		case 2:
			a=c->first_name+" "+c->last_name;
			cout << "Enter New Last Name : ";
			cin >> c->last_name;
			cout << "Last Name Updated" << endl;
			r->remove_from_NameNum(a,c->phone_number,0);
			r->addNameNum(c->phone_number,c->first_name+" "+c->last_name);
			out->changes(c->last_name,choice,c->phone_number);
			inc->changes(c->last_name,choice,c->phone_number);
			break;
		case 4:
			cout << "Enter New Email Address : ";
			cin >> c->email;
			cout << "Email Address Updated" << endl;
			out->changes(c->email,choice,c->phone_number);
			inc->changes(c->email,choice,c->phone_number);
			break;
		case 5:
			cout << "Enter New Address : ";
			cin.ignore();
			getline(cin,c->address);
			cout << "Address Updated" << endl;
			out->changes(c->address,choice,c->phone_number);
			inc->changes(c->address,choice,c->phone_number);
			break;
		case 3:
			n=c->phone_number;
			r->remove_from_Registry(c->phone_number,1);
			cout << "Enter New Number : ";
			cin>>c->phone_number;
			//r->number_contact_table[r->search_Index(c->phone_number)]=NULL;
			r->add_to_Registry(c);
			out->changes("",choice,n);
			inc->changes("",choice,n);
			return 1;
			break;
	}
	return 0;
}


void editContact(Registry *r,Call_Log* inc, Call_Log* out)
{
	string num;
	cout << "ENTER CREDENTIALS : ";
	cin.ignore();
	getline(cin,num);
	if(isNumber(num)) 
	{
		Contact *c=r->search_contact_number(num);
		if(c!=NULL && Edit_Contact_details(r,c,inc,out)) 
		{
//		r->number_contact_table[r->calculate_key(c->phone_number)]=c;
//		r->remove_from_Registry(num,1);
		}
		if (c!=NULL)
		{
			c->Print_Contact_Details();
		}
		else 
		{
			cout << "CONTACT NOT IN LIST" << endl;
		}
	} 
	else 
	{
		Contact *c[10];
		int i=0;
		int searchKey=r->calculate_key(num);
		while(r->NameNum[searchKey][0]!="") 
		{
			if(num=="")
			{
				return;
			}
			else if(r->NameNum[searchKey][0]==num) 
			{
				c[i]=r->search_contact_number(r->NameNum[searchKey][1]);
				cout << endl;
				cout<<i+1<<":\n";
				c[i]->Print_Contact_Details();
				++i;
			}
			searchKey=(searchKey+1)%r->table_size;
		}
		int ind;
		if(i>0 && c[0]!=NULL) 
		{
			cout<<"ENTER CONTACT INDEX : ";
			cin>>ind;
			if(Edit_Contact_details(r,c[ind-1],inc,out)) 
			{
//			r->number_contact_table[r->calculate_key(c[ind-1]->phone_number)]=c[ind-1];
//			r->remove_from_Registry(num,1);
			}
			return;
		}
		cout << "NO SUCH CONTACT EXISTS" << endl;
	}
}

bool isValidEmail(const std::string& email)
{
	bool atFound = false;
	bool dotFoundAfterAt = false;
	bool charsBeforeAt = false;
	bool charsBeforeDot = false;
	bool charsAfterDot = false;

	for (int i = 0; i < email.size(); ++i) 
	{
		char c = email[i];

		if (c == '@') 
		{
			atFound = true;

			if(i>0) 
			{
				charsBeforeAt=true;
			}

		} 
		else if (atFound && c == '.') 
		{
			dotFoundAfterAt = true;
			if(i - 1 > 0) 
			{
				charsBeforeDot=true;
			}
		} 
		else if (dotFoundAfterAt && i + 1 < email.size()) 
		{
			charsAfterDot = true;
		}
	}
	return atFound && dotFoundAfterAt && charsBeforeAt && charsBeforeDot && charsAfterDot;
}

bool isValidPhoneNumber(string& s)
{
	for (int i = 0; i < s.size(); ++i) 
	{
		char c = s[i];
		if (!isdigit(c) && c != '+') 
		{
			return false;
		}
	}
	return true;
}

void add_Contact(Registry *registry)
{
	system("cls");
	cout << "\t\t\t\t#################################################################" << endl;
	cout << "\t\t\t\t#                       NEW CONTACT INFO                        #" << endl;
	cout << "\t\t\t\t#################################################################" << endl;
	cout << endl;
	string fname;
	string lname;
	string number;
	string email;
	string address;
	cout << "Enter First Name: ";
	cin >> fname;
	cout << "Enter Last Name: ";
	cin >> lname;
	cout << "Enter Contact Number: ";
	cin >> number;

	while (!isValidPhoneNumber(number)) 
	{
		cout << "Invalid phone number. Please enter a valid phone number: ";
		cin >> number;
	}

	while (registry->search_Index(number)!=-1) 
	{
		cout<<"Number already exists\nEnter Contact Number: ";
		cin>>number;
	}

	while (true) 
	{
		cout << "Enter Email Address: ";
		cin >> email;

		if (isValidEmail(email)) 
		{
			break;
		} 
		else 
		{
			cout << "Invalid email address. Please enter a valid email." << endl;
		}
	}

	cin.ignore();
	cout << "Enter Address: ";
	getline(cin,address);
	Contact * newContact = new Contact (fname, lname, number, email, address);
	newContact->Print_Contact_Details();
	registry->add_to_Registry(newContact);
	cout << "\t\t\t\t#################################################################" << endl;
	cout << "\t\t\t\t#                   CONTACT ADDED TO REGISTRY                   #" << endl;
	cout << "\t\t\t\t#################################################################" << endl;
	system("cls");
}


void dial_call(Registry S, Call_Log *Outgoing,string num)
{
	//TIME
	time_t now = time(NULL);
	tm *localTime = localtime(&now);
	char timeBuffer[80];
	strftime(timeBuffer, sizeof(timeBuffer), "%Y-%m-%d %H:%M:%S", localTime);
	cout << "CALL INITIATED SUCCESSFULLY\n" << endl;
	cout << "CALL START TIME : " << timeBuffer << endl;
	cout << "PRESS ENTER TO END CALL" << endl;
	getche();
	cout<<endl;

	time_t after = time(NULL);
	tm *localTime2 = localtime(&after);

	char timeBuffer2[80];
	strftime(timeBuffer2, sizeof(timeBuffer2), "%Y-%m-%d %H:%M:%S", localTime2);

	strftime(timeBuffer, sizeof(timeBuffer), "%H:%M:%S", localTime);
	// cout << "Time " << timeBuffer << endl;

	time_t timeDiff = after - now;
	int sec = timeDiff;

	int minut, hrs;
	minut = timeDiff / 60;
	hrs = minut / 60;
	minut = minut % 60;
	sec=sec%60;

	cout << "CALL DURATION : ";
	if(hrs>0)
	{
		cout<< hrs << " hours " << minut << " minutes " << sec << " seconds." << endl;
	}
	else if(minut>0)
	{
		cout<< minut << " minutes " << sec << " seconds." << endl;
	}
	else
	{
		cout<< sec << " seconds." << endl;
	}
	Contact *c=S.search_contact_number(num);
	if(c!=NULL) 
	{
		Contact C (c);
		Outgoing->Add_to_Log(C,now,hrs,minut,sec);
	} else 
	{
		Contact C (num);
		Outgoing->Add_to_Log(C,now,hrs,minut,sec);
	}
}


void caller(Registry S, Call_Log *I)
{
	string num;
	cout << "CALL DIALER" << endl;
	cout << "-----------\n" << endl;
	cout << "ENTER PHONE NUMBER OR NAME: ";
	cin.ignore();
	getline(cin,num);
	if (isNumber(num)) 
	{
		dial_call(S, I ,num);
		return;
	} 
	else 
	{
		Contact *c[10];
		int i=0;
		int searchKey=S.calculate_key(num);
		while(S.NameNum[searchKey][0]!="") 
		{
			if(num=="")
			{
				return;
			}
			else if(S.NameNum[searchKey][0]==num) 
			{
				c[i]=S.search_contact_number(S.NameNum[searchKey][1]);
				cout<<i+1<<":\n";
				c[i]->Print_Contact_Details();
				++i;
				searchKey=(searchKey+1)%S.table_size;
			}
		}
		int ind;
		if(i>0 && c[0]!=NULL) 
		{
			cout<<"ENTER CONTACT INDEX : ";
			cin>>ind;
			dial_call(S, I ,c[ind-1]->phone_number);
			return;
		}
		cout << "NO SUCH CONTACT EXISTS" << endl;
	}
}


void printHeading()
{
	cout << "\t\t\t\t#################################################################" << endl;
	cout << "\t\t\t\t#                                                               #" << endl;
	cout << "\t\t\t\t#                                                               #" << endl;
	cout << "\t\t\t\t#                       CONTACT REGISTERY                       #" << endl;
	cout << "\t\t\t\t#                                                               #" << endl;
	cout << "\t\t\t\t#                                                               #" << endl;
	cout << "\t\t\t\t#################################################################" << endl;
}


int main()
{
	cout << "\t\t\t\t#################################################################" << endl;
	cout << "\t\t\t\t#                                                               #" << endl;
	cout << "\t\t\t\t#                                                               #" << endl;
	cout << "\t\t\t\t#               PLEASE WAIT WHILE THE REGISTRY LOADS            #" << endl;
	cout << "\t\t\t\t#                                                               #" << endl;
	cout << "\t\t\t\t#                                                               #" << endl;
	cout << "\t\t\t\t#################################################################" << endl;
	delay(2);
	system("cls");
//	system("color F0");
	system("color 9");
	Registry Storage(1000);
	Call_Log Incoming;
	Call_Log Outgoing;
	//a few hardcoded contacts to save time of manually adding them
	Contact *c1= new Contact ("Roohan","Ahmed","03032160324","roohanbvs@gmail.com", "B-767 Block 13");
	Contact *c2= new Contact ("Uzain","Ahmed","03314567321","uzain@gmail.com", "B-767 Block 13");
	Contact *c3= new Contact ("Zaid", "Vohra", "03001234352", "zaid@yahoo.com", "B-767 Block 13");
	Contact *c4= new Contact ("Shahmeer", "Haq", "03001234567", "mshuk@gmail.com", "B-767 Block 13");
	Contact *c5= new Contact ("Roohan", "Ahmed", "03002430005", "roohanahmed10@gmail.com", "B-767 Block 13");
	Contact *c6= new Contact ("Aadil", "Raja", "03001234568", "aadil@gmail.com", "B-767 Block 13");
	Storage.add_to_Registry(c1);
	Storage.add_to_Registry(c2);
	Storage.add_to_Registry(c3);
	Storage.add_to_Registry(c4);
	Storage.add_to_Registry(c5);
	Storage.add_to_Registry(c6);
	while (1) 
	{
		try{
			printHeading();
			int controller = -1;
			cout << "\n\t: OPTIONS :\n" << endl;
			cout << "1 : ADD CONTACT" << endl;
			cout << "2 : SEARCH CONTACT" << endl;
			cout << "3 : DIAL A CALL" << endl;
			cout << "4 : RECIEVE A CALL" << endl;
			cout << "5 : PRINT OUTGOING CALL LOG" << endl;
			cout << "6 : PRINT INCOMING CALL LOG" << endl;
			cout << "7 : EDIT CONTACT" << endl;
			cout << "8 : DELETE CONTACT" << endl;
			cout << "9 : PRINT ALL CONTACTS" << endl;
			cout << "0 : EXIT THE PROGRAM\n" << endl;
			cout << "PLEASE CHOOSE AN OPTION :: ";
			cin >> controller;
			if (cin.fail()) 
            {
                cin.clear();
                cin.ignore(numeric_limits<streamsize>::max(), '\n');
                throw invalid_argument("Invalid input. Please enter a valid option.");
            }
			if (controller == 0)
			{
			break;
			}
			string s;

			switch (controller) 
			{	
				case 1:
					cout << "\nCREATING NEW CONTACT" << endl;
					cout << "--------------------" << endl;
					add_Contact(&Storage);
					break;
				case 2:
					cout << "\nSEARCHING CONTACT" << endl;
					cout << "-----------------" << endl;
					Storage.search_contact_number();
					break;
				case 3:
					cout << "\nDIALING A CALL" << endl;
					cout << "--------------" << endl;
					caller(Storage, &Outgoing);
					break;
				case 4:
					cout << "\nRECEIVING A CALL" << endl;
					cout << "----------------" << endl;
					caller(Storage, &Incoming);
					break;
				case 5:
					cout << "\nPRINTING OUTGOING CALL LOG" << endl;
					cout << "--------------------------" << endl;
					Outgoing.print_log();
					break;
				case 6:
					cout << "\nPRINTING INCOMING CALL LOG" << endl;
					cout << "--------------------------" << endl;
					Incoming.print_log();
					break;
				case 7:
					cout << "\nEDIT CONTACTS" << endl;
					cout << "-------------" << endl;
					editContact(&Storage,&Incoming, &Outgoing);
					break;
				case 8:
					cout << "\nDELETING CONTACT" << endl;
					cout << "----------------" << endl;
					cout << "ENTER CREDENTIALS : ";
					cin.ignore();
					getline(cin,s);
					Storage.remove_from_Registry(s,1);
					break;
				case 9:
					cout << "\nPRINTING ALL CONTACTS" << endl;
					cout << "---------------------" << endl;
					Storage.print_all_contacts();
					break;
				default:
					cout << "Invalid input. Please enter a valid option." << endl;
			}
		}
		catch (exception& e)
        {
            cerr << e.what() << endl;
        }
	}
	cout << "\t\t\t\t##################################################################" << endl;
	cout << "\t\t\t\t#                                                                #" << endl;
	cout << "\t\t\t\t#                THANKYOU FOR USING OUR REGISTRY                 #" << endl;
	cout << "\t\t\t\t#                                                                #" << endl;
	cout << "\t\t\t\t#                       EXITING PROGRAM NOW                      #" << endl;
	cout << "\t\t\t\t#                                                                #" << endl;
	cout << "\t\t\t\t#                           GOOD BYE                             #" << endl;
	cout << "\t\t\t\t#                                                                #" << endl;
	cout << "\t\t\t\t##################################################################" << endl;
}
