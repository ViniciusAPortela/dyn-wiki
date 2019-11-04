#!version: 1.0.0
#!article_version: 1.0.0
#!title: Como instalar o Xampp
#!desc: Aprenda como instalar o xampp em sua máquina
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
<cmd sudo>./xampp-installer.run</cmd>

</img src='xampp.png'>

<only32>
	<scripts>
		</file tag='script-file' src='script_x86.sh' name='install_xampp.sh'>
	</scripts>
</only32>
<only64>
	<scripts>
		</file tag='script-file' src='script_x64.sh' name='install_xampp.sh'>
	</scripts>
</only64>