#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <time.h>
#include <conio.h>
int count=0,flag=0,count2=0;
char string_4[10][5],string_3[10][4];
int t=0;
int PermuteFourLetter(char *str, int index);
int PermuteThreeLetter(char *str,int index);
int swap(char *ch1, char *ch2);             // called to permute
int ThreeLetterCombinations(char str[5]);   // 4 to 3 letter word manual combination


int main()
{

	char pstr[5],str[5],vow[6]={"AEIOU"},con[22]={"BCDFGHJKLMNPQRSTVWXYZ"},choice;
	int y=0,i,x=0;

	srand(time(0));
do{
    do
    {
    flag=0;count=0;count2=0;
    
	for(i=0;i<2;++i)
    {
	    x=rand()%21;
	    str[i]=con[x];		
    } 
   	for(i=2;i<4;++i)
    {
	    x=rand()%5;
	    str[i]=vow[x];	
    } 
    
    strcpy(pstr,str);

    PermuteFourLetter(str, 0);
    if(flag==1)
	{
    	ThreeLetterCombinations(str);
    }
}while(count<2 ||count2<2);

char str4[5],cstr4[5]="0000";
int correct=0;

 system("cls");
 printf("\t\t\t\t\t  Welcome to Word Find Game\n\n");
 printf("Instructions:\n1)The game will give you four jumbled letters\n");
 printf("2)You have to make 2 Four Letter words\n");
 printf("3)Then, you have to make 2 Three Letter words\n");
 printf("\n");
 printf("Jumbled letters are:\t");
 printf("%s\n",pstr);
 printf("\n");
 
 
do
{
   
	printf("\nEnter 4 letter word: ");
	t=0;
    fflush(stdin);
    scanf("%s",str4);
    strupr(str4);
    if(strcmp(cstr4,str4)==0)
	{
		printf("\nGotcha you can not enter same words again!\tTry again!\n");
	}
	else
	{
    for(i=0;i<count;++i)
    {
	if((strcmp(str4,string_4[i])==0))
	{
		printf("\nCorrect\n");
	    t=1;
		++correct;
		strcpy(cstr4,str4);
		break;
	}
    }
    if(t==0)
    {
    	printf("\nUnsuccessful Try!\tTry again!\n");
	}
   }
}while((correct!=2));

  char str3[4],cstr3[4]="000";
  int correct2=0;

 do
 {  
	t=0;
	printf("\nEnter 3 letter word: ");
    fflush(stdin);
    scanf("%s",str3);
    strupr(str3);
    if(strcmp(cstr3,str3)==0)
	{
		printf("\nGotcha you can not enter same words again!\tTry again!\n");
	}
	else
	{
    for(i=0;i<count2;++i)
    {
	if((strcmp(str3,string_3[i])==0))
	{
		printf("\nCorrect\n");
		++correct2;
		t=1;
		strcpy(cstr3,str3);
		break;
	}
    }
    if(t==0)
    {
    	printf("\nUnsuccessful Try!\tTry again!\n");
	}
    }
}while((correct2!=2));

printf("\nCongrats on making this far!\n");
printf("\nEnter 'e' to end, enter any other letter to continue: ");
choice=getche();

}while(choice!='e');

printf("\n\nThanks for playing");

    return 0;
}



int ThreeLetterCombinations(char str[5])
{
	int i,j;
	char arr1[4],arr2[4],arr3[4],arr4[4];

	arr1[0]=str[0];
	arr1[1]=str[1];
	arr1[2]=str[2];
	arr1[3]='\0';
	arr2[0]=str[1];
	arr2[1]=str[2];
	arr2[2]=str[3];
	arr2[3]='\0';
	arr3[0]=str[0];
	arr3[1]=str[1];
	arr3[2]=str[3];
	arr3[3]='\0';
	arr4[0]=str[0];
	arr4[1]=str[2];
	arr4[2]=str[3];
	arr4[3]='\0';
	
    PermuteThreeLetter(arr1,0);
    PermuteThreeLetter(arr2,0);
    PermuteThreeLetter(arr3,0);
    PermuteThreeLetter(arr4,0);
    
	return 0;
}

int PermuteThreeLetter(char *str, int index)
{
int i,tru,j;
char line[4];

if (index == 2)
{
  FILE *fptr=fopen("Three Letter Word Dictionary.txt","r");
  
  while(fgets(line,4,fptr)!=NULL)
  {
    
    if(strcmp(line,str)==0)
  	{
  		tru=1;
  		if(count2==0)
  		{
  			strcpy(string_3[count2],str);
  	        ++count2;
		}
		else
		{
		for(i=0;i<count2;++i)
  		{
  			if(strcmp(str,string_3[i])==0)
  			{
  				tru=0;
			}
		}
		if(tru!=0)
		{
			strcpy(string_3[count2],str);
  	        ++count2;
		}
		}
	}
  }
  fclose(fptr); 
}
else
{
    for (i = index; i <= 2; i++)
    {
        swap((str+index), (str+i));
        PermuteThreeLetter(str, index+1);
        swap((str+index), (str+i)); 
    }
}
}

int swap(char *ch1, char *ch2)
{
    char temp;
    temp = *ch1;
    *ch1 = *ch2;
    *ch2 = temp;
    return 0;
}

int PermuteFourLetter(char *str, int index)
{
int i,tru,j,try=0;
char line[5];


if (index == 3)
{
  FILE *fptr=fopen("Four Letter Word Dictionary.txt","r");
     
  
  while(fgets(line,5,fptr)!=NULL)
  {
	
  	
  	if(strcmp(line,str)==0)
  	{
  		tru=1;
  		if(count==0)
  		{
  			strcpy(string_4[count],str);
  	        ++count;
            flag=1;
		}
		else
		{
		for(i=0;i<count;++i)
  		{
  			if(strcmp(str,string_4[i])==0)
  			{
  				tru=0;
			}
		}
		if(tru!=0){
			strcpy(string_4[count],str);
  	        ++count;
  	        flag=1;
		}
		}
	}
  }
  fclose(fptr);  
}
else
{
    for (i = index; i <= 3; i++)
    {
        swap((str+index), (str+i));
        PermuteFourLetter(str, index+1);
        swap((str+index), (str+i)); 
    }
}
}


