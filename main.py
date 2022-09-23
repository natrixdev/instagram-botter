import os;import version;import github;import owner;import instas;import instagram;import proxies;import colorama; import accounts
owner.name=("natrix")
github.url=("https://github.com/natrixdev") 

requirements = "https://github.com/natrixdev/instagram-botter/blob/main/reqs.txt"

owner_repos = "https://github.com/natrixdev?tab=repositories"
howto_use="https://github.com/natrixdev/instagram-botter/blob/main/README.md"         
                                                                                                     
this.code = "https://github.com/natrixdev/instagram-botter/blob/main/main.py"

from instabot import likes, views, followers

os.system("title Instagram followers, likes and views botter.")
os.color("a")

def __main__:
 account_name=input("Account name ? ")
   if account_name=="":
     print('please input a real name')
   else if req.on(`www.instagram.com/%account_name%`)==Flase:
     print('I didnt found your instagram account')
 print("Please choose a botter category:')
 print("");print("[1] - Likes ");print("");print("[2] - Views ");print("");print("[1] - Followers ");print("");
   choose=input('> ')
       if choose=="1":
          url=input('Paste your instagram post url (your account need to be public')
          if req.url==False:
       print('cannot find the post')
          else: 
       accnum=1
            while True:
                accounts.newInstagram('goto --like %url%')
              accnum= accnum+1
       print(str(accnum) + " likes done ")
                 
            
   
  
 
