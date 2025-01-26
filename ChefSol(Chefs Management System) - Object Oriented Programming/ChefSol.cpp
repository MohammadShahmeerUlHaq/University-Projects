#include <ctime>
#include <fstream>
#include <iostream>
#include <stdlib.h>
#include <string.h>
#include <string>
#include <cstring>
using namespace std;
class PAYMENT;

class CHEF
{

private:
  char name[30];
  bool availability;
  char city[30];
  char cuisine[30];
  char experience[100];
  int hourly_rate;
  int ID;
  int password;

public:
  CHEF()
  {
    strcpy(name, "Default");
    strcpy(city, "Default");
    strcpy(cuisine, "Default");
    strcpy(experience,"Default");
    hourly_rate = 1;
    availability = true;
    password = 3333;
  }

  CHEF(char n[30], char cu[30], char c[30], int id, int pass, int hr, bool a) 
  {
    strcpy(name, n);
    strcpy(city, cu);
    strcpy(cuisine, c);
    ID = id;
    hourly_rate = hr;
    password = pass;
    availability = a;
  }
  void setID(int x)
  {
  	ID=x;
  }
  int getID()
  {
  	return ID;
  }

 void get_chef_details(int x)
 {
   if (strcmp(name,"Default")!=0)
   {
    cout << "Chef Details:" << endl;
    cout << "-----------------" << endl;
    cout << "Name: " << name << endl;
    cout << "Preferred Cuisine: " << cuisine << endl;
    cout << "City of Residence: " << city << endl;
    cout << "Chef ID: " << ID << endl;
    cout << "Hourly Rate ($): " << hourly_rate << endl;
    cout <<"Experience: "<<experience<<endl;

    if (availability == true)
      cout << "Current Status: Available for bookings" << endl;
    else
      cout << "Current Status: Not available for bookings" << endl;
    if(x)
    cout << "Password: " << password << endl;
    cout << "-----------------" << endl;
}
}

  //****setters****
  void set_name() 
  {
    cout << "Please enter your name: \n";
     fflush(stdin);
    scanf("%[^\n]s",&name);
   
  }
  void set_experience()
  {
  	cout<<"Please enter your experience: \n";
  	fflush(stdin);
  	scanf("%[^\n]s",&experience);
  }

  void set_cuisine() 
  {
    cout << "Select Your Cuisine" << endl;
    cout << "1) For Italian" << endl;
    cout << "2) For French" << endl;
    cout << "3) For Chinese" << endl;
    cout << "4) For Greek" << endl;
    int x, y = 0;

    do 
	{
      x = 0;
      y = 0;
      cin >> x;
      if (x == 1)
        strcpy(cuisine, "Italian");
      else if (x == 2)
        strcpy(cuisine, "French");
      else if (x == 3)
        strcpy(cuisine, "Chinese");
      else if (x == 4)
        strcpy(cuisine, "Greek");
      else 
	  {
       cout << "Invalid selection. Please enter between 1 and 4.\n";
        y = 1;
      }
    } while (y == 1);
  }
  
  int get_id() {return ID;}
  
  void set_city() 
  {
    int x, y;
    cout << "Please select your city from the list below by entering the corresponding number:\n";
    cout << "1) Karachi\n2) Islamabad\n3) Lahore\n4) Multan\n:- "; 

    do
	{
      x, y = 0;
      cin >> x;
      if (x == 1) {
        strcpy(city, "Karachi");
      } else if (x == 2) {
        strcpy(city, "Islamabad");
      } else if (x == 3) {
        strcpy(city, "Lahore");
      } else if (x == 4) {
        strcpy(city, "Multan");
      } else {
        cout << "Invalid input. Please enter a number between 1 and 4.\n";
        y = 1;
      }
    } while (y == 1);
    cout << "Thank you, " << name << ". We have recorded your city as " << city << ".\n";
  }

  void set_ID(int n) { ID = n; }

  void set_password(int n) { password = n; }

  void set_hourly_rate(int n) { hourly_rate = n; }

  void set_availability(bool n) { availability = n; }

  void get_name() { cout << name; }

  void get_cuisine() { cout << cuisine; }

  int get_ID() { return ID; }

  int get_password() { return password; }

  int get_hourly_rate() { return hourly_rate; }

  bool get_availability() { return availability; }
  
  void write() 
  {
    ofstream fout;
    fout.open("CHEF_signup100.txt", ios::app);
    if (!fout)
      cout << "Error in creating file.." << endl;
    else
      fout.write((char *)this, sizeof(*this));
    
    fout.close();
  }

  int view(int flag, char x[30], char y[20]) 
  {
    ifstream fin;
    int c = 0; // for counting
    fin.open("CHEF_signup100.txt", ios::in);

    if (!fin)
      cout << "\nFile not Found\n";
    else 
	{

      fin.read((char *)this, sizeof(*this));
      while (!fin.eof())
	  {
        if (flag == 0) // to view all chefs for admin
          get_chef_details(1);

        else if (flag == 1) 
		{
          if (strcmp(cuisine, x) == 0 && strcmp(city, y) == 0 && availability == true) 
		  {
            get_chef_details(0);
            ++c;
          }
        }
        fin.read((char *)this, sizeof(*this));
      }
      fin.close();
      
      if (c == 0) 
	  {
        cout << "None available right now\n";
        return 0;
      } 
	  else
        return 1;
    }
  }
  
  bool view2(int x, int y) 
  {
    ifstream fin;
    int flag = 0;
    fin.open("CHEF_signup100.txt", ios::in);

    if (!fin)
      cout << "\nFile not Found\n";
    else 
	{
      fin.read((char *)this, sizeof(*this));
      while (!fin.eof()) 
	  {
        if ((ID == x) && (password == y)) 
		{
          flag = 1;
          get_chef_details(1);
        }

        fin.read((char *)this, sizeof(*this));
      }
      fin.close();
      if (flag == 0)
        return false;
      else if (flag == 1)
        return true;
    }
  }

  // view for admin
  void view3(int a) 
  {
    ifstream fin;
    fin.open("CHEF_signup100.txt", ios::in);

    if (!fin)
      cout << "\nFile not Found\n";
    else 
	{

      fin.read((char *)this, sizeof(*this));
      while (!fin.eof()) 
	  {
        if (a == 1) // to view all chefs for admin
          get_chef_details(1);
        else if (a == 2) 
		{
          if (strcmp(city, "Karachi") == 0)
            get_chef_details(0);
        } 
		else if (a == 3) 
		{
          if (strcmp(city, "Islamabad") == 0)
            get_chef_details(0);
        } 
		else if (a == 4) 
		{
          if (strcmp(city, "Lahore") == 0)
            get_chef_details(0);
        } 
		else if (a == 5) 
		{
          if (strcmp(city, "Multan") == 0)
            get_chef_details(0);
        }
		else if(a==6)
		{
			if(availability==true)
				get_chef_details(0);
		}
		else if(a==7)
		{
			if(availability==false)
				get_chef_details(0);
		}
		
		 else
          cout << "chef does not exist" << endl;

        fin.read((char *)this, sizeof(*this));
      }
      fin.close();
    }
  }

  void update(int flag, int id) 
  {
    if (flag == 0) 
	{
      cout << "Enter to update:" << endl<< "1) Availability\n2) City\n3) Cuisine\n4) Hourly Rate\n5) Password\n6) Experience\n:- ";
      int x = 0;
      cin >> x;
      do 
	  {
        CHEF c5;
        ofstream fout;
        ifstream fin;
        fout.open("ac.txt", ios::app);
        fin.open("CHEF_signup100.txt", ios::in);
        if (!fout)
          cout << "Error in creating file.." << endl;
        else if (!fin)
          cout << "Error in reading file.." << endl;
        else
        {
          fin.read((char *)&c5, sizeof(c5));
          while (!fin.eof())
		  {
            if (id == c5.get_ID()) 
			{
              if (x == 1) 
			  {
                int a;
                cout << "Enter 1 for True and 0 for false: ";
                cin >> a;
                if (a)
                  c5.set_availability(true);
                else if (!a)
                  c5.set_availability(false);
              } 
			  else if (x == 2)
                c5.set_city();
			  else if (x == 3)
                c5.set_cuisine();
			  else if (x == 4)
			  {
                int r = 0;
                cout << "Enter New Hourly Rate: ";
                cin >> r;
                c5.set_hourly_rate(r);
              } 
			  else if (x == 5) 
			  {
                int flag2 = 0;
                int p1, pass, old;
                do 
				{
                  flag2 = 0;
                  cout << "Enter your Current Password: ";
                  cin >> old;
                  if (old == c5.password) 
				  {
                    cout << "Set your New Password: ";
                    cin >> p1;
                    cout << "Confirm your New Password: ";
                    cin >> pass;
                    if (pass == p1)
                      c5.set_password(pass);
                    else 
					{
                      cout << "Password is not verified\n";
                      flag2 = 1;
                    }
                  }
				  else
				  {
				  	flag2 = 1;
				  	cout << "Incorrect Password\n";
				  }
                } while (flag2 == 1);
              }
              else if(x==6)
              {
              	c5.set_experience();
			  }

              fout.write((char *)&c5, sizeof(c5));
            }
			else 
			{
              fout.write((char *)&c5, sizeof(c5));
            }
            fin.read((char *)&c5, sizeof(c5));
          }
          fin.close();
          fout.close();
          remove("CHEF_signup100.txt");
          rename("ac.txt", "CHEF_signup100.txt");
        }
        cout << "Enter to update:" << endl
             << "1) Availability\n2) City\n3) Cuisine\n4) Hourly Rate\n5) Password\n6) Experience\n0) To Finish Updating\n:- ";
        x = 0;
        cin >> x;
      } while (x);
    }

    else if (flag == 1) 
	{
      CHEF c5;
      ofstream fout;
      ifstream fin;
      fout.open("ac.txt", ios::app);
      fin.open("CHEF_signup100.txt", ios::in);
      if (!fout) 
        cout << "Error in creating file.." << endl;
      else if (!fin)
        cout << "Error in reading file.." << endl;
      else
      {
        fin.read((char *)&c5, sizeof(c5));
        while (!fin.eof()) 
		{
          if (id == c5.get_ID()) 
		  {
            c5.set_availability(false);
            fout.write((char *)&c5, sizeof(c5));
          } 
		  else
            fout.write((char *)&c5, sizeof(c5));

          fin.read((char *)&c5, sizeof(c5));
        }
        fin.close();
        fout.close();
        remove("CHEF_signup100.txt");
        rename("ac.txt", "CHEF_signup100.txt");
      }
    }
  }
};



class USER 
{
private:
  char name[30];
  char number[30];
  char city[30];
  int ID;
  int password;
  int wallet;
  PAYMENT *p1;

public:
  USER() 
  {
    strcpy(name, "Default");
    strcpy(number, "Default");
    strcpy(city, "Default");
    password = 333;
    wallet = 0;
  }
  
int get_wallet(){return wallet;}

void updateWallet(int id)
{
     USER u5;
     int z=0;
      ofstream fout;
      ifstream fin;
      fout.open("ac.txt", ios::app);
      fin.open("user_signup99.txt", ios::in);
      if (!fout)
        cout << "The requested file could not be found.\n";
      else if (!fin)
        cout << "The requested file could not be found.\n";
      else
      {
        fin.read((char *)&u5, sizeof(u5));
        while (!fin.eof())
		{
		  if(id==u5.getID())	
		  {
		  	
		  	cout<<"Current Wallet: "<<u5.wallet<<endl;
		  	cout<<"Enter the amount to add\n:-";
		  	cin>>z;
		  	u5.wallet=u5.wallet+z;
		  	fout.write((char*)&u5,sizeof(u5));
		  }
		  else
		  {
		  		fout.write((char*)&u5,sizeof(u5));
		  }
		  fin.read((char *)&u5, sizeof(u5));
		} 
	
}
         fin.close();
        fout.close();
        remove("user_signup99.txt");
        rename("ac.txt", "user_signup99.txt");
}
void payment(CHEF c5,int ID);

void get_user_details()
{
  if (strcmp(name,"Default")!=0)
  {
    cout << "User Details:" << endl;
    cout << "-----------------" << endl;
    cout << "Name: " << name << "\n";
    cout << "Contact Number: " << number << "\n";
    cout << "City of Residence: " << city << "\n";
    cout << "User ID: " << ID << "\n";
     cout << "Password: " << password << endl;
    cout << "Wallet Balance ($): " << wallet << "\n";
    cout << "-----------------" << endl;
  }
}

void view3(int a) 
{
    ifstream fin;
    fin.open("user_signup99.txt", ios::in);

    if (!fin)
      cout << "\nFile not Found\n";
    else
	{
		char i[50]; char num[50];
      fin.read((char *)this, sizeof(*this));
      if (a == 1) 
		{
          
          cout << "Enter name you want to search\n:- ";
          fflush(stdin);
          scanf("%[^\n]s",&i);
       }
       if (a == 2) 
		{
         
          
          cout << "Enter the number\n:-";
          fflush(stdin);
          scanf("%[^\n]s",&num);
      }
      while (!fin.eof()) 
	  {
        if (a == 0) // to view all chefs for admin
          get_user_details();
        else if (a == 1) 
		{
          if (strcmp(name, i) == 0)
            get_user_details();
        }
		else if (a == 2) 
		{
          if (strcmp(number, num) == 0)
            get_user_details();
        }
        else if (a == 3)
        {
        	if (strcmp(city,"Karachi")==0)
                get_user_details();
        }
        else if (a == 4)
        {
            if (strcmp(city,"Islamabad")==0)
                get_user_details();
        }
        else if (a == 5)
        {
            if (strcmp(city,"Lahore")==0)
                get_user_details();
        }
        else if (a == 6)
        {
            if (strcmp(city,"Multan")==0)
                get_user_details();
        }

        fin.read((char *)this, sizeof(*this));
      }
      fin.close();
    }
  }

  bool view2(int x, int y) 
  {
    ifstream fin;
    int flag = 0;
    fin.open("user_signup99.txt", ios::in);

    if (!fin)
      cout << "\nFile not Found\n";
    else 
	{
      fin.read((char *)this, sizeof(*this));
      while (!fin.eof()) 
	  {
        if ((ID == x) && (password == y))
        {
	      flag = 1;
	      get_user_details();
	      
}
        fin.read((char *)this, sizeof(*this));
      }
      fin.close();
      if (flag == 0)
        return false;
      else if (flag == 1)
        return true;
    }
  }

  int getID() { return ID; }
  int getPassword() { return password; }
  void setID(int z) { ID = z; }

  void rent_chef() 
  {
    int id;
    ifstream fin;
    CHEF c5;
    cout << "Please enter the ID of the Chef you wish to book: ";
    cin >> id;

    fin.open("CHEF_signup100.txt", ios::in);
    if (!fin)
        cout << "The requested file could not be found.\n";
    else 
	{
        fin.read((char *)&c5, sizeof(c5));
        while (!fin.eof()) 
		{
            if (id == c5.get_ID()) 
			{
               
                break;
            }
            fin.read((char *)&c5, sizeof(c5));
        }
        fin.close();
    }
    c5.update(1, id);
    payment(c5, ID);
}

  void check_chef() 
  {
    char cuisine[30];
    int x, y;
    cout << "We see you are interested in hiring a chef.\n";
    cout << "Please select the cuisine you prefer from the list below:\n";
    cout << "1) Italian\n";
    cout << "2) French\n";
    cout << "3) Chinese\n";
    cout << "4) Greek\n";

    do {
        x = 0;
        y = 0;
        cout<<":- ";
        cin >> x;
        if (x == 1)
            strcpy(cuisine, "Italian");
        else if (x == 2)
            strcpy(cuisine, "French");
        else if (x == 3)
            strcpy(cuisine, "Chinese");
        else if (x == 4)
            strcpy(cuisine, "Greek");
        else 
		{
            cout << "Invalid selection. Please enter a number from 1 to 4 to choose your preferred cuisine.\n";
            y = 1;
        }
    } while (y == 1);
    
    CHEF c3;
    int z = c3.view(1, cuisine, this->city);
    if (z == 1)
      	rent_chef();
}

  void manage_wallet() {}

  //****setters****

  void set_name() 
  {
  	fflush(stdin);
    cout << "Please enter your name: ";
    scanf("%[^\n]s",&name);
    fflush(stdin);
  }

  void set_number() 
  {
    cout << "Please enter your phone number: ";
    fflush(stdin);
    scanf("%[^\n]s",&number);
    
  }

  void set_city() {
    int x, y;
    cout << "Please select your city from the list below by entering the corresponding number:\n";
    cout << "1) Karachi\n2) Islamabad\n3) Lahore\n4) Multan\n:-"; 

    do 
	{
      x, y = 0;
      cin >> x;
      if (x == 1)
        strcpy(city, "Karachi");
      else if (x == 2)
        strcpy(city, "Islamabad");
      else if (x == 3)
        strcpy(city, "Lahore");
      else if (x == 4)
        strcpy(city, "Multan");
      else 
	  {
        cout << "Invalid input. Please enter a number between 1 and 4.\n";
        y = 1;
      }
    } while (y == 1);
    cout << "Thank you, " << name << ". We have recorded your city as " << city << ".\n";
  }

  void set_password(int n) { password = n; }
  void set_wallet(int n) { wallet = n; }
  
  void write() 
  {
    ofstream fout;
    fout.open("user_signup99.txt", ios::app);
    if (!fout)
      cout << "Error in creating file.." << endl;
    else
      fout.write((char *)this, sizeof(*this));
    fout.close();
  }
  void view() 
  {
    ifstream fin;
    fin.open("user_signup99.txt", ios::in);

    if (!fin)
      cout << "\nFile not Found\n";
    else 
	{
      fin.read((char *)this, sizeof(*this));
      while (!fin.eof()) 
	  {
        fin.read((char *)this, sizeof(*this));
      }
    }
    fin.close();
  }

void update_wallet_file(int id,int x)
{
    USER u5;
    ofstream fout;
    ifstream fin;
    fout.open("ac.txt",ios::app);
    fin.open("user_signup99.txt",ios::in);
    if (!fout)
     cout << "Error in creating file.." << endl;
    else if (!fin)
     cout << "Error in reading file.." << endl;
  else
  {
    fin.read((char *)&u5, sizeof(u5));
        while (!fin.eof()) 
		{
          if (id == u5.getID()) 
            {
             u5.set_wallet(x);
             fout.write((char *)&u5, sizeof(u5));
            }
           else
           	fout.write((char *)&u5, sizeof(u5));

          fin.read((char *)&u5, sizeof(u5));
        }
        fin.close();
        fout.close();
        remove("user_signup99.txt");
        rename("ac.txt", "user_signup99.txt");
      }
  }

  void update(int id) 
  {
    char number[30];
    char city[30];
    int password;
    cout << "Enter to update:" << endl<< "1) Contact Number\n2) City\n3) Password\n:- ";
    int x = 0;
    cin >> x;
    do 
	{
      USER u5;
      ofstream fout;
      ifstream fin;
      fout.open("ac.txt", ios::app);
      fin.open("user_signup99.txt", ios::in);
      if (!fout)
        cout << "The requested file could not be found.\n";
      else if (!fin)
        cout << "The requested file could not be found.\n";
      else
      {
        fin.read((char *)&u5, sizeof(u5));
        while (!fin.eof()) 
		{
          if (id == u5.getID()) 
		  {
            if (x == 1)
              u5.set_number();
            else if (x == 2)
              u5.set_city();
            else if (x == 3) 
			{
              int flag2 = 0;
              int p1, pass, old;
              do 
			  {
                flag2 = 0;
                cout << "Enter your Current Password: ";
                cin >> old;
                if (old == u5.password) {
                  cout << "Set your New Password: ";
                  cin >> p1;
                  cout << "Confirm your New Password: ";
                  cin >> pass;
                  if (pass == p1)
                    u5.set_password(pass);
                  else 
				  {
                    cout << "Password is not verified\n";
                    flag2 = 1;
                  }
                }
				else
				{
					flag2 = 1;
					cout<<"Incorrect Password\n";
				}

              } while (flag2 == 1);
            }
            fout.write((char *)&u5, sizeof(u5));
          } 
		  else
            fout.write((char *)&u5, sizeof(u5));
          fin.read((char *)&u5, sizeof(u5));
        }
        fin.close();
        fout.close();
        remove("user_signup99.txt");
        rename("ac.txt", "user_signup99.txt");
      }
      cout << "Enter to update:" << endl<< "1) Contact Number\n2) City\n3) Password\n0) To Finish Updating\n:- ";
      x = 0;
      cin >> x;
    } while (x);
  }
};



class ADMIN 
{
private:
  const string user_name;
  const string password;

public:
  ADMIN() : user_name("admin_123"), password("Fast1234") {}
  void delete_coupon() 
  {
    ofstream fout;
    ifstream fin;
    string x, line;
    fout.open("tempfile.txt", ios::out);
    fin.open("coupon.txt", ios::in);
    if (!fout)
      cout << "The requested file could not be found.\n";
	else if (!fin)
       cout << "The requested file could not be found.\n";
	else 
	{
      cout << "Please input the coupon code you wish to delete\n:-";
      cin>>x;
      while (getline(fin, line)) 
	  {
        if (x != line)  
		{
          fout << line;
          fout << "\n";
        }
      }
    }
    fin.close();
    fout.close();
    remove("coupon.txt");
    rename("tempfile.txt", "coupon.txt");
  }
  void add_coupon() 
  {
    ofstream fout;
    string x;
    fout.open("coupon.txt", ios::app);
    if (!fout)
      cout << "The requested file could not be found.\n";
    else 
	{
      cout << "Enter your coupon code: \n";;
      cout << "The coupon code should be in the format XY-50 (where 50 represents a 50 percent discount)\n:-";
      cin>>x;
      fout << x;
      fout << "\n";
    }
    fout.close();
  }
  
  int read_coupon(int flag, string x) 
  {
    ifstream fin;
    string line;
    char y[3];
    int z;
    int flag2 = 0;
    fin.open("coupon.txt", ios::in);
    if (!fin)
      cout << "The requested file could not be found.\n";
    else 
	{
      if (flag == 0) 
	  {
        while ((getline(fin, line))) 
		{
			cout<<"Coupons:\n";
          cout << line << endl;
        }
      } 
	  else if (flag == 1) 
	  {
        while ((getline(fin, line))) 
		{
          if (line == x) 
		  {
            flag2 = 1;
            y[0] = x[3];
            y[1] = x[4];
            y[2] = '\0';
            z = atoi(y);
            break;
          }
        }
      }
    }
    fin.close();
    if (flag == 1) 
	{
      if (flag2 == 1)
        return z;
      else 
	  {
        cout << "The coupon code you've entered seems to be incorrect\n";
        return 0;
      }
    }
    return 1;
  }
  
  string get_user_name() { return user_name; }
  string get_password() { return password; }
};



class PAYMENT 
{
private:
  USER user;
  CHEF chef;
  string time_of_order;
  double hours;
  double amount;
  string payment_mehtod;
  ADMIN a1;
  float discount;

public:

  bool wallet_process(int ID)
{
  USER u2;
  ifstream fin;
  fin.open("user_signup99.txt",ios::in);
  
  if(!fin)
     cout << "The requested file could not be found.\n";
  else 
  {
    fin.read((char*)&u2,sizeof(u2));
    while(!fin.eof())
    {
      if(u2.getID()==ID)
        break;
      fin.read((char*)&u2,sizeof(u2));
    }
  }
  fin.close();
  
  if(u2.get_wallet()>=amount)
  {
    cout<<"Wallet transaction has been successfully completed.\n";
    u2.update_wallet_file(u2.getID(),u2.get_wallet()-amount);
    return 1;
  }
  else
  {
    cout<<"Insufficient funds in your wallet.\n";
    return 0;
}
}

  void print_receipt() 
  {
    cout << "\n--------------------------------------------------\n";
    cout << "                     RECEIPT                      \n";
    cout << "--------------------------------------------------\n";
     cout << "Congratulations! Your chef booking has been confirmed.\n";
    cout << "Chef Name: ";
    chef.get_name();
    cout << "\n";
    cout << "Chef ID: " << chef.get_id() << "\n";
    cout << "Cuisine: ";
    chef.get_cuisine();
    cout << "\n";
    cout << "Payment Method: " << payment_mehtod << "\n";
    cout << "Hours Rented: " << hours << "\n";
    cout << "Total Amount: " << amount << "\n";
    time_t now = time(0);
    time_of_order = ctime(&now);
    cout << "Order Time: " << time_of_order;
    cout << "--------------------------------------------------\n";
}
  void process_payment(CHEF c5,int ID) 
  {
    chef = c5;
    int y;
    int choice = 0,choice2=0;
    cout << "Please enter the number of hours you would like to book the chef for: ";
    cin >> hours;
    amount = hours * c5.get_hourly_rate();
    cout << "The total amount for your booking is: " << amount << " units.\n";
     do 
	{
        y = 0;
        cout << "Would you like to apply a coupon to your booking?\n";
        cout << "1. Yes\n";
        cout << "2. No\n:- ";
        cin >> choice;

        if (choice == 1) 
		{
            discount = apply_coupon();
            amount = (1 - (discount / 100)) * amount;
            cout << "Your discounted amount is: " << amount << " units.\n";
        } 
		else if (choice == 2) 
		{
            // No coupon applied
        } 
		else 
		{
            cout << "Invalid selection. Please enter either 1 for Yes or 2 for No.\n";
            y = 1;
        }
    } while (y == 1);
    do 
	{
        y = 0;
        cout << "Please select your preferred method of payment:\n";
        cout << "1. Credit/Debit Card\n";
        cout << "2. Wallet\n";
        cout << "3. Cash On Delivery\n";
        cin >> choice2;

        if (choice2 == 1)
            payment_mehtod = "Card";
        else if (choice2 == 2) 
		{
            payment_mehtod = "Wallet";
            int fund_check=wallet_process(ID);
            if(fund_check==0)
            {
            	y=1;
			}
            
        } 
		else if (choice2 == 3)
            payment_mehtod = "Cash On Delivery";
        else
		{
            cout << "Invalid selection. Please enter a number from 1 to 3 to select your payment method.\n";
            y = 1;
        }
    } while (y == 1);


    print_receipt();
}

  float apply_coupon() 
  {
    string x;
    int y;
    do 
	{
      cout << "Please input your discount code:\n";
      cin>>x;
      y = a1.read_coupon(1, x);
    } while (y == 0);
    return y;
  }
};



void USER::payment(CHEF c5,int ID) 
{
  p1 = new PAYMENT;
  p1->process_payment(c5, ID);
}


// Function to print the heading in a fancy way
void printHeading() 
{
    cout << "\t\t\t\t################################################################" << endl;
    cout << "\t\t\t\t#                                                              #" << endl;
    cout << "\t\t\t\t#                                                              #" << endl;
    cout << "\t\t\t\t#                       CHEF SOLUTIONS                         #" << endl;
    cout << "\t\t\t\t#                                                              #" << endl;
    cout << "\t\t\t\t#                                                              #" << endl;
    cout << "\t\t\t\t################################################################" << endl;
}

// Function to print the punchline
void printPunchline() 
{
	cout << endl;
    cout << "\t\t\t\t  Your meal prep assistant, bringing you culinary perfection!\n" << endl;
}


int main() 
{
	system("color F5");
    printHeading();
    printPunchline();

  ADMIN a1;
  USER u2;
  string n,p,num,city,cui;
  int flag = 0, pass,choice,choice2,flag1,flag2,rate, id;
  bool verify;
  

    USER u1;
    CHEF c1;
    do 
    {
      cout << "\n\nPlease select your profile type:\n";
      cout << "1) Customer\n";
      cout << "2) Administrator\n";
      cout << "3) Chef\n";
        cout<<"4) Exit\n";
      cout << ":- ";
      cin >> choice;
      if (choice == 1) 
      {
      	flag=1;
        cout << "\nWelcome Customer! Ready to explore some delicious recipes?\n";
        do 
        {
          cout << "\nPlease select an option:\n";
          cout << "1) Sign Up\n";
          cout << "2) Log In\n";
          cout << ":- ";
          cin >> choice2;
          flag1 = 0;
          if (choice2 == 1) 
          {
            int p1;
            ifstream fin;
            fin.open("user_signup99.txt", ios::in);
            if (!fin)
            {
              cout << "\nYour assigned User ID is: 1000.\n";
              u1.setID(1000);
            } 
            else 
            {
              fin.read((char *)&u2, sizeof(u2));

              while (!fin.eof()) 
              {
                fin.read((char *)&u2, sizeof(u2));
              }
              cout << "\nYour assigned User ID is: " << u2.getID() + 1 << "."<<endl;
              u1.setID(u2.getID() + 1);
            }
            fin.close();
            do 
            {
              flag2 = 0;
              cout << "Set your Password: ";
              cin >> p1;
              cout << "Confirm your password: ";
              cin >> pass;
              if (pass == p1) 
              {
              	cout << "Your password has been set successfully.\n";
                u1.set_password(pass);
              } 
              else 
              {
                cout << "Password is not verified\n";
                flag2 = 1;
              }

            } while (flag2 == 1);
            u1.set_name();
            fflush(stdin);

            u1.set_number();
            fflush(stdin);

            u1.set_city();
            cout << "\nPlease set up your wallet.\nEnter the initial balance you would like to deposit\n:- ";
            int o;
            cin >> o;
            u1.set_wallet(o);
            cout << "\nThank you! Your wallet has been credited with an initial balance of " << o << ".\n";
            u1.write();
          } 
          else if (choice2 == 2) 
          {
            int x, y, v,c = 0,flag10;
            do
            {
            flag10=0;
            cout << "Please enter your User ID: ";
            cin>>x;
            cout << "Please enter your Password: ";
            cin >> y;
            USER u3;
            v = u3.view2(x, y);
            if (v == true) 
			{
              cout << "You have successfully logged in.\n";
              do
              {
			   c=0;
			      cout << "Select your desired action: \n";
                  cout << "1) Check Chef\n2) Update Your Info\n3) Add Credits to your Wallet\n:- ";
                  cin>>c;
                  if(c==1)
                  	 u3.check_chef();
				  else if(c==2)
				  	u3.update(x);
				  else if(c==3)
				  u3.updateWallet(x);
				  else
				  {
				  	cout << "Invalid choice. Please enter between 1 and 3.\n";
				  	c=4;
				  }
              	
			  }while(c==4);
               
            }
            else
            {
            	cout << "Invalid Username or Password. Please try again.\n";
            	flag10=1;
			}
		    }while(flag10==1);
          }
          else 
          {
            cout << "Invalid input. Please enter either 1 or 2.\n";
            flag1 = 1;
          }
        } while (flag1 == 1);
      }

      else if (choice == 2) 
      {
      	flag=1;
        int option, option2;
        int flag9=0;
        cout << "Welcome Administrator! Ready to manage the culinary universe?\n";
        
        do 
		{
    flag9 = 0;
    cout << "Please enter your Username: ";
    cin>>n;
    cout << "Enter your Password: ";
    cin >> p;
    if (!(a1.get_user_name() == n && a1.get_password() == p))
        cout << "The details you entered are incorrect.\nLet's try again, shall we?\n";
    else 
	{
        flag9  = 1;
        cout << "\nLogin successful!\n";
    }
       } while (flag9 == 0);
        
        cout << "Select your desired action: \n";
        cout << "1) Review chef profiles\n2) Browse user profiles\n3) Incorporate a new coupon\n";
        cout << "4) Remove an existing coupon\n5) Delete an existing chef details from the record\n";
		cout << "6) Delete an existing user details from the record\n7) Exit\n:- ";
		
        cin >> option;
        while(option!=7)
        {
        if (option == 1) 
        {
          cout << "\n\nSelect your desired action: \n";
          cout << "1) Display all chef profiles\n2) Display chef profiles located in Karachi\n";
          cout << "3) Display chef profiles located in Islamabad\n4) Display chef profiles located in Lahore\n";
          cout << "5) Display chef profiles located in Multan\n6) Display all available chef profiles\n";
		  cout << "7) Display all unavailable chef profiles\n:- ";
          cin >> option2;
          switch (option2) 
          {
          case 1:
            c1.view3(1);
            break;
          case 2:
            c1.view3(2);
            break;
          case 3:
            c1.view3(3);
            break;
          case 4:
            c1.view3(4);
            break;
          case 5:
            c1.view3(5);
            break;
          case 6:
          	c1.view3(6);
		  	break;
		  case 7:
		  	c1.view3(7);
		  	break;	    
          default:
            cout << "Invalid action. Please enter between 1 and  7.\n";
          }

        }

        else if (option == 2) 
        {
          cout << "\n\nSelect your desired action: \n";
          cout << "1) Display all user profiles\n2) Search for a user by name\n";
          cout << "3) Search for a user by contact number\n4) Display user profiles located in Karachi\n";
          cout << "5) Display user profiles located in Islamabad\n6) Display user profiles located in Lahore";
          cout << "\n7) Display user profiles located in Multan\n:- ";
          cin >> option2;

          switch (option2) 
          {
          case 1:
            u1.view3(0);
            break;
          case 2:
            u1.view3(1);
            break;
          case 3:
            u1.view3(2);
            break;
          case 4:
          	u1.view3(3);
		    break;  
		  case 5:
		  	u1.view3(4);
		    break;
		  case 6:
		  	u1.view3(5);
		    break;  
		  case 7:
		  	u1.view3(6);
		    break;
		  default:
            cout << "Invalid action. Please enter between 1 and  7.\n";
          }
        } 
        else if (option == 3) 
        {
          a1.add_coupon();
        } 
        else if (option == 4) 
        {
          a1.read_coupon(0, "admin");
          a1.delete_coupon();
        } 
        else if (option == 5)
		{
			int idToRemove;
			int exist=0;
  			cout << "Enter the ID of the chef to remove: ";
 			cin >> idToRemove;
			ifstream inputFile("CHEF_signup100.txt");
  			ofstream outputFile("temp.txt");
  			CHEF c5;
			inputFile.read((char *)&c5, sizeof(c5));
		while (!inputFile.eof())
	    {
        if (c5.getID() != idToRemove)
 			outputFile.write((char *)&c5, sizeof(c5));
        else
        	exist=1;
        inputFile.read((char *)&c5, sizeof(c5));
        } 	
		inputFile.close();
    	outputFile.close();
        inputFile.close();
        outputFile.close();
     	remove("CHEF_signup100.txt");
     	rename("temp.txt", "CHEF_signup100.txt");
		if(exist==0)
			cout << "The record for the Chef with ID: " << idToRemove << " does not exists." << endl;
		else
		{
			cout << "The record for the Chef with ID: " << idToRemove << " has been successfully deleted from the system." << endl;
			ifstream fin;
		    fin.open("CHEF_signup100.txt",ios::in);
		    if( fin.seekg(0, ios::end).tellg() == 0)
		     {
		     	fin.close();
		     	remove("CHEF_signup100.txt");
			 }
		}
	    }
	    
		else if (option == 6)
		{
		int idToRemove;
		int exist=0;
  		cout << "Enter the ID of the user to remove: ";
 		cin >> idToRemove;
 		ifstream inputFile("user_signup99.txt");
  		ofstream outputFile("tem.txt");
  		USER u5;	  
		inputFile.read((char *)&u5, sizeof(u5));	  
		while (!inputFile.eof())
	    {
        if (u5.getID() != idToRemove)
 			   outputFile.write((char *)&u5, sizeof(u5));
        else
        	exist=1;
        inputFile.read((char *)&u5, sizeof(u5));
        }
		inputFile.close();
    	outputFile.close();
        remove("user_signup99.txt");
     	rename("tem.txt", "user_signup99.txt");
		if(exist==0)
			cout << "The record for the user with ID: " << idToRemove << " does not exists." << endl;
		else
		{
			cout << "The record for the user with ID: " << idToRemove << " has been successfully deleted from the system." << endl;
		    ifstream fin;
		    fin.open("user_signup99.txt",ios::in);
		    if( fin.seekg(0, ios::end).tellg() == 0)
		    {
		     	fin.close();
		     	remove("user_signup99.txt");     
		    }
		}
		}
		
		else if(option<=0 || option >7)
       
	    	cout << "Invalid action. Please enter between 1 and 7.\n";
	   
	    cout << "Select your desired action: \n";
        cout << "1) Review chef profiles\n2) Browse user profiles\n3) Incorporate a new coupon\n";
        cout << "4) Remove an existing coupon\n5) Delete an existing chef details from the record\n";
		cout << "6) Delete an existing user details from the record\n7) Exit\n:- ";
		
        cin >> option;
		
  }
	  }
  
      
      else if (choice == 3) 
      {
      	flag=1;
        do
        {
        	CHEF c9;
        cout << "Welcome Chef! Ready to create some culinary masterpieces?\n";
        
        
          cout << "\nPlease select an option:\n";
          cout << "1) Sign Up\n2) Log In\n:- ";
          cin >> choice2;
          flag1 = 0;
          if (choice2 == 1) 
          {
          	int p1;
            ifstream fin;
             fin.open("CHEF_signup100.txt", ios::in);
             if(!fin)
             {
             	cout << "\nYour assigned User ID is: 2000.\n";
             	c1.setID(2000);
			 }
            else
            {
            	fin.read((char *)&c9, sizeof(c9));
            	while (!fin.eof()) 
              {
                fin.read((char *)&c9, sizeof(c9));
              }
              cout << "\nYour assigned User ID is: " << c9.getID() + 1 << "."<<endl;
              c1.setID(c9.getID() + 1);
			}
			fin.close();

            do 
            {
              flag2 = 0;
              cout << "Please set your password: \n";
              cin >> p1;
              cout << "Please re-enter your password for confirmation: \n";
              cin >> pass;
              if (pass == p1) 
              {
              	cout << "Your password has been set successfully.\n";
                c1.set_password(pass);
              } 
              else 
              {
                cout << "The passwords do not match. Please try again.\n";
                flag2 = 1;
              }
            } while (flag2 == 1);
            c1.set_name();
            fflush(stdin);
            c1.set_cuisine();
            c1.set_city();
            cout << "Enter your Rate per Hour: ";
            cin >> rate;
            c1.set_hourly_rate(rate);
            c1.set_experience();
            c1.write();
          } 
          else if (choice2 == 2) 
          {
            int x, y,flag11=0;
            do
            {
            flag11=0;
            cout << "Please enter your Chef ID: \n";
            cin >> x;
            cout << "Please enter your Password: \n";
            cin >> y;
            CHEF c3;
            verify = c3.view2(x, y);
            if (verify == true) 
			{
              cout << "You have successfully logged in.\n";
              int c = 0;
              cout << "Do you want to update any info?\nEnter 1 for Yes, 0 for No\n:- ";
              cin >> c;
              if (c)
                c3.update(0, x);
            } 
            else 
            {
              cout << "Invalid Username or Password. Please try again.\n";
              flag11=1;
            }
			}while(flag11==1);

          } 
          else 
          {
          cout << "Invalid choice. Please enter either 1 or 2.\n";
            flag1 = 1;
          }
        } while (flag1 == 1);
      } 
      else if(choice==4)
      {
      	break;
	  }
      else 
      {
        cout << "Invalid input. Please enter a number between 1 and 4.\n";
        flag = 1;
      }
    } while (flag == 1);
    
     cout << "\t\t\t\t##################################################################" << endl;
    cout << "\t\t\t\t#                                                                #" << endl;
    cout << "\t\t\t\t#                                                                #" << endl;
    cout << "\t\t\t\t#                          GOOD BYE                              #" << endl;
    cout << "\t\t\t\t#                                                                #" << endl;
    cout << "\t\t\t\t#                                                                #" << endl;
    cout << "\t\t\t\t##################################################################" << endl;
}
