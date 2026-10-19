export const examples = [
  {
    id: 'normal',
    label: '1. Comentário normal',
    value: 'Adorei o post!',
    explain: 'Só texto. Nos dois jeitos, aparece igual.',
  },
  {
    id: 'negrito',
    label: '2. Comentário com negrito',
    value: 'Adorei o <b>post</b>!',
    explain:
      'Tem uma tag <b>. Como texto, a tag aparece escrita. Como HTML, ela vira negrito.',
  },
  {
    id: 'ataque',
    label: '3. Comentário malicioso',
    value: '<img src="nao-existe.png" onerror="alert(\'Este código foi injetado pelo comentário!\')">',
    explain:
      'Uma imagem que não existe. Quando ela falha ao carregar, o navegador roda o código do atributo onerror.',
  },
];
