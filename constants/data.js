module.exports = {
  title: 'Atualizando o Kernel do Linux',
  desc: 'Aprenda a atualizar o kernel do seu Linux',
  lang: 'pt',
  data: [
    {
      tag: 'title',
      data: '#1 Adicionar Repositório'
    },
  
    {
      tag: 'content',
      data: 'A forma mais fácil de atualizar o kernel do linux é com' +
            ' o software ukuu, para instalá-lo, basta adicionar o repositório:'
    },
  
    {
      tag: 'command',
      sudo: true,
      data: 'apt-add-repository ppa:teejee2008/ppa'
    },
  
    {
      tag: 'command',
      sudo: true,
      data: 'sudo apt update'
    },
  
    {
      tag: 'title',
      data: '#2 Instalar ukuu'
    },
  
    {
      tag: 'command',
      sudo: true,
      data: 'apt install ukuu'
    },
  
    {
      tag: 'title',
      data: '#3 Escolher Versão e Instalar'
    },
  
    {
      tag: 'image',
      src: 'ukuu.png'
    },
  
    {
      tag: 'content',
      data: '<>Após abrir o programa, basta clicar na versão que deseja instalar e apertar em <i>"Install"</i></>'
    },
  
    {
      tag: 'title',
      data: '#Scripts'
    },
  
    {
      tag: 'scripts',
      data: [
        {
          tag: 'script-file',
          src: 'ukuu_install.sh',
          name: 'ukuu_install.sh'
        }
      ]
    }
  ]
}

// Old Version

/* Texts */
//t1: 'A forma mais fácil de atualizar o kernel do linux é com o software ukuu, para instalá-lo, basta adicionar o repositório:',
//t2: <>Após abrir o programa, basta clicar na versão que deseja instalar e apertar em <i>"Install"</i></>,

/* Commands */
//c1: '# sudo apt-add-repository ppa:teejee2008/ppa',
//c2: '# sudo apt update',
//c3: '# sudo apt install ukuu',