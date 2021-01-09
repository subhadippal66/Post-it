const btn = document.querySelector('#btn_submit');
const warning = document.querySelector('.warning');
document.getElementById("image_").addEventListener("change", function() { 
  if(this.files.length > 2){
    window.alert(`You cannot Upload more than 2 Files`);
    warning.style.display = 'flex';
    btn.classList.add('disabled');
  }
  if(this.files.length <= 2){
    window.alert(`You uploaded ${this.files.length} files`);
    warning.style.display = 'none';
    btn.classList.remove('disabled');
  }
});