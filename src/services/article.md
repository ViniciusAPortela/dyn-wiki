#!version: 1.0.0
#!article_version: 1.0.0
#!title: Aprenda a atualizar o kernel do seu Linux
#!desc: Atualizando o Kernel do Linux
#!lang: pt

# #1 ${title[0]}
${content[0]}

<only32>
	<cmd>wget https://ufpr.dl.sourceforge.net/project/xampp/XAMPP%20Linux/7.0.8/xampp-linux-7.0.8-0-installer.run -O xampp-installer.run</cmd>
</only32>
<only64>
	<cmd>wget "https://sourceforge.net/projects/xampp/files/XAMPP%20Linux/7.3.7/xampp-linux-x64-7.3.7-1-installer.run/download"	-O xampp-installer.run</cmd>
</only64>

# #1 ${title[1]}
${content[1]}
<cmd>chmod +x xampp-installer.run</cmd>

${content[2]}
<cmd sudo>./xampp-installer.run</cmd>

<img src='xampp.png'>

<scripts>
	<only32>
		<file src='script_x86.sh' name='install_xampp.sh'>
	</only32>
	<only64>
		<file src='script_64.sh' name='install_xampp.sh'>
	</only64>
</scripts>