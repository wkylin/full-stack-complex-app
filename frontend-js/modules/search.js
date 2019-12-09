const axios = require('axios');

export default class Search {
  constructor() {
    this.injectHTML();
    // alert('Search js is successfully being.')
    this.headerSearchIcon = document.querySelector('.header-search-icon');
    this.closeLiveSearch = document.querySelector('.close-live-search');
    this.serachOverlay = document.querySelector('.search-overlay');
    this.inputFiled = document.querySelector('#live-search-field');
    this.resultArea = document.querySelector('.live-search-results');
    this.loaderIcon = document.querySelector('.circle-loader');
    this.typingWaitTimer='';
    this.previousValue= '';
    this.events();
  }
  
  events() {
    
    this.headerSearchIcon.addEventListener('click', (event) => {
      event.preventDefault();
      this.openOverlay();
    });
    
    this.closeLiveSearch.addEventListener('click', (event) => {
      event.preventDefault();
      this.closeOverlay();
    });
    
    this.inputFiled.addEventListener('keyup', (event) => {
      this.keyPressHandler();
    } )
  }
  
  // 3. Methods
  
  keyPressHandler() {
    let value = this.inputFiled.value;
    if(value == ''){
      clearTimeout(this.typingWaitTimer);
      this.hideLoaderIcon();
      this.hideResultsArea();
    }
    if(value != '' && value != this.previousValue){
      clearTimeout(this.typingWaitTimer);
      this.showLoaderIcon();
      this.hideResultsArea();
      this.typingWaitTimer = setTimeout(() => this.sendRequest(), 750)
    }
    this.previousValue = value;
    
  }
  
  sendRequest() {
    axios.post('/search', {
      searchTerm: this.inputFiled.value
    }).then(response => {
      // console.log(response.data);
      this.renderResultHTML(response.data);
    }).catch(()=> {
       alert("Hello, the request failed.")
    })
  }
  
  renderResultHTML(posts){
    if(posts.length){
      this.resultArea.innerHTML= `<div class="list-group shadow-sm">
              <div class="list-group-item active"><strong>Search Results</strong> (4 items found)</div>
  
              <a href="#" class="list-group-item list-group-item-action">
                <img class="avatar-tiny" src="https://gravatar.com/avatar/b9216295c1e3931655bae6574ac0e4c2?s=128"> <strong>Example Post #1</strong>
                <span class="text-muted small">by barksalot on 0/14/2019</span>
              </a>
              <a href="#" class="list-group-item list-group-item-action">
                <img class="avatar-tiny" src="https://gravatar.com/avatar/b9408a09298632b5151200f3449434ef?s=128"> <strong>Example Post #2</strong>
                <span class="text-muted small">by brad on 0/12/2019</span>
              </a>
              <a href="#" class="list-group-item list-group-item-action">
                <img class="avatar-tiny" src="https://gravatar.com/avatar/b9216295c1e3931655bae6574ac0e4c2?s=128"> <strong>Example Post #3</strong>
                <span class="text-muted small">by barksalot on 0/14/2019</span>
              </a>
              <a href="#" class="list-group-item list-group-item-action">
                <img class="avatar-tiny" src="https://gravatar.com/avatar/b9408a09298632b5151200f3449434ef?s=128"> <strong>Example Post #4</strong>
                <span class="text-muted small">by brad on 0/12/2019</span>
              </a>
            </div>`;
    } else {
      this.resultArea.innerHTML= `<p class="alert alert-dander text-center shadow">Sorry, we could not find any results for that search.</p>`;
    }
    
    this.hideLoaderIcon();
    this.showResultsArea();
  }
  showLoaderIcon() {
    this.loaderIcon.classList.add('circle-loader--visible');
  }
  
  hideLoaderIcon() {
    this.loaderIcon.classList.remove('circle-loader--visible');
  }
  showResultsArea() {
    this.resultArea.classList.add('live-search-results--visible')
  }
  
  hideResultsArea() {
    this.resultArea.classList.remove('live-search-results--visible')
  }
  
  openOverlay() {
    this.serachOverlay.classList.add('search-overlay--visible');
    setTimeout(() => {
      this.inputFiled.focus();
    }, 500)
  }
  
  closeOverlay() {
    this.serachOverlay.classList.remove('search-overlay--visible')
  }
  //  live-search-results--visible
  injectHTML() {
    document.body.insertAdjacentHTML('beforeend', `
      <div class="search-overlay">
      <div class="search-overlay-top shadow-sm">
        <div class="container container--narrow">
          <label for="live-search-field" class="search-overlay-icon"><i class="fas fa-search"></i></label>
          <input type="text" id="live-search-field" class="live-search-field" placeholder="What are you interested in?">
          <span class="close-live-search"><i class="fas fa-times-circle"></i></span>
        </div>
      </div>
      <div class="search-overlay-bottom">
        <div class="container container--narrow py-3">
          <div class="circle-loader"></div>
          <div class="live-search-results"></div>
        </div>
      </div>
      </div>
    `);
  }
}
