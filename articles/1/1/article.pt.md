#!version: 1.0.0
#!article_version: 1
#!title: Como instalar o Xampp
#!desc: Aprenda como instalar o xampp em sua máquina
#!article_image: article.png
#!lang: pt

# #1 Baixando o XAMPP
Para instalar o xampp, basta baixar seu instalador:

<only32>
	<cmd>wget https://ufpr.dl.sourceforge.net/project/xampp/XAMPP%20Linux/7.0.8/xampp-linux-7.0.8-0-installer.run -O xampp-installer.run</cmd>
</only32>
<only64>
	<cmd>wget "https://sourceforge.net/projects/xampp/files/XAMPP%20Linux/7.3.7/xampp-linux-x64-7.3.7-1-installer.run/download"	-O xampp-installer.run</cmd>
</only64>

# #2 Instalando o XAMPP
Mude as permissões para permitir executá-lo:
<cmd>chmod +x xampp-installer.run</cmd>

E por fim, execute-o:
<cmd sudo='true'>./xampp-installer.run</cmd>