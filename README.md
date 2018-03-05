# SPA Marvel Heroes

Desafio Objective, Single Page Application sobre os heróis da Marvel.

Como acessar
------
O aplicativo está disponível no endereço [paulojunior95.github.io (HTTPS)](https://paulojunior95.github.io/). Não é possível executar o aplicativo localmente, pois ele utiliza uma API da Marvel que limita as requisições vindas apenas de domínios registrados. 

Por utilizar a tecnologia de service workers, o aplicativo possui uma forte política de cache, o que permite que o mesmo seja executado offline, porém eventualmente pode ser necessário limpar o cache do navegador ou atualizar a página do app usando Ctrl+F5.

Tela principal
------
A tela principal do aplicativo apresenta, de forma paginada, os principais heróis da Marvel da atualidade, com opção de realização de buscas pelo nome (a busca não difere letras maiúsculas de minúsculas) e cada item faz um link com a tela de detalhes.

![alt text][principal]

Tela Detalhe
------
Nesta parte, são apresentadas mais informações a respeito do personagem escolhido na tela principal, incluindo séries e eventos, com suas respectivas descrições e criadores.

![alt text][detalhe]


Compatibilidade
------
|Sistema     |Chrome|Firefox|Opera|Edge |Safari|
|------------|:----:|:-----:|:---:|:---:|:----:|
|Windows     | Sim  |  Sim  | Sim | Sim |      |
|Linux - Arch| Sim  |  Sim  |     |     |      |
|Android     | Sim  |  Sim  | Sim | Sim |      |
|iOS         | Sim  |       |     |     | Sim  |

[principal]: https://github.com/paulojunior95/paulojunior95.github.io/blob/master/spec/Pagina%20principal.png "Tela principal"
[detalhe]: https://github.com/paulojunior95/paulojunior95.github.io/blob/master/spec/Pagina%20detalhe.png "Tela detalhe (exemplo)"
