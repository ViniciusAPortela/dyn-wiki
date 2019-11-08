#!version: 1.0.0
#!article_version: 1
#!title: How to Install Xampp
#!desc: Learn how to install xampp in your machine
#!article_image: article.png
#!lang: en

# #1 Downloading XAMPP
Para instalar o xampp, basta baixar seu instalador:

<only32>
	<cmd>wget https://ufpr.dl.sourceforge.net/project/xampp/XAMPP%20Linux/7.0.8/xampp-linux-7.0.8-0-installer.run -O xampp-installer.run</cmd>
</only32>
<only64>
	<cmd>wget "https://sourceforge.net/projects/xampp/files/XAMPP%20Linux/7.3.7/xampp-linux-x64-7.3.7-1-installer.run/download"	-O xampp-installer.run</cmd>
</only64>

# #2 Installing XAMPP
Change the permissions to allow executing
<cmd>chmod +x xampp-installer.run</cmd>

Finally, execute it:
<cmd sudo>./xampp-installer.run</cmd>