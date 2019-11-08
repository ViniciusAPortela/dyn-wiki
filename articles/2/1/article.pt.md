#!version: 1.0.0
#!title: Como atualizar o kernel linux
#!desc: Aprenda como atualizar o kernel do seu linux

# Veja a versão atualizada :), mude no topo!

# #1 Adicionar Repositório

A forma mais fácil de atualizar o kernel do linux é com o software ukuu, para instalá-lo, basta adicionar o repositório:

<cmd sudo='true'>apt-add-repository ppa:teejee2008/ppa</cmd>

<cmd sudo='true'>apt update</cmd>

# #2 Instalar ukuu
<cmd sudo='true'>apt install ukuu</cmd>

# #3 Escolher Versão e Instalar
</img src='ukuu.png'>

Após abrir o programa, basta clicar na versão que deseja instalar e apertar em <i>"Install"</i>

<scripts>
	</file tag='script-file' src='ukuu_install.sh' name='ukuu_install.sh'>
</scripts>