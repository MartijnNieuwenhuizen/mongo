const items = document.querySelectorAll('.thing');
if (items.length) {
  Array.prototype.forEach.call(items, item => {
    item.addEventListener('click', editItem);
  });
}

function editItem(e) {
  console.log(e.target);
}


console.log('sflskdjfsldkfj');
