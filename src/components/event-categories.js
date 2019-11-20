const templateCategory = (props) => {
  const template = `
    <div class="div-category">
        <button class="b-category" >
            <img src=${props.src} alt="" class="img-category">
            <p class="p-category">${props.title}</p>
        </button>
    </div>
    `;
  return template;
};

window.a = {
  handleClick: (event, callBack) => {
    callBack(event.target.id);
  },
};

export default templateCategory;
