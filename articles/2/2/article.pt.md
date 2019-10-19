#!version: 1.0.0
#!article_version: 1
#!title: Como atualizar o kernel linux
#!desc: Aprenda como atualizar o kernel do seu linux
#!lang: pt

# #1 Adicionar Repositório

A forma mais fácil de atualizar o kernel do linux é com o software ukuu, para instalá-lo, basta adicionar o repositório:

<cmd>apt-add-repository ppa:teejee2008/ppa</cmd>

<cmd>sudo apt update</cmd>

# #2 Instalar ukuu
<cmd>apt install ukuu</cmd>

# #3 Escolher Versão e Instalar
</img src='ukuu.png'>

Após abrir o programa, basta clicar na versão que deseja instalar e apertar em <i>"Install"</i>

<scripts>
	</file tag='script-file' src='ukuu_install.sh' name='ukuu_install.sh'>
</scripts>