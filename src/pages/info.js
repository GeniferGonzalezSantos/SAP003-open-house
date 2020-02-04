function Info() {
  document.querySelector('.container-category').innerHTML = '';
  document.querySelectorAll('.arrow').forEach((arrow) => arrow.classList.add('hide'));


  const template = `
<div>
    <article class="description">
      <h1>O Zero800</h1>
      <span> É uma plataforma que conecta pessoas aos mais extraordinários eventos gratuitos na cidade de São Paulo.
      Através dos nossos serviços possibilitamos que organizadores possam criar, organizar, gerir e divulgar eventos, proporcionando a melhor experiência
      na busca de eventos gratuitos. 
      </span>
      <p> Zero800 a melhor plataforma de busca!</p>
      </article>
</div>
    `;
  return template;
}

export default Info;
