import 'https://code.jquery.com/jquery-3.6.1.min.js';

import products from './dataProduct.js';

const containProducts = $('#contain-products');
const userLogin = $('#user-login');

const modal = $('.modal');
const btn = $('.btn-register');
const span = $('.close');
const yourPhone = $('#your-phone');
const yourPass = $('#your-pass');
const showError = $('#show-error');

const inputNumberPhone = $('[name=numberPhone]');

const btnLogin = $('#btn-login');
const inputPasswordLogin = $('[name=password]');
const showErrorPassLogin = $('#show-error-pass-login');
const inputPhoneLogin = $('[name=phone-login]');
const showErrorPhoneLogin = $('#show-error-phone-login');
const statusLogin = $('#status-login');

const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

const regNumber = new RegExp('^[0-9]+$');

const app = {
  LOCAL_STORAGE_DATA_USER: 'LOCAL_STORAGE_DATA_USER',
  LOCAL_IS_USER_LOGIN: 'LOCAL_IS_USER_LOGIN',

  localStorage: {
    get: (key, initValue = {}) => {
      const result = window.localStorage.getItem(key);
      return result ? JSON.parse(result) : initValue;
    },
    set: (key, value) => {
      window.localStorage.setItem(key, JSON.stringify(value));
    },
  },

  renderProducts: () => {
    containProducts.html(
      products.map(
        ({ productImage, discount, price, sold, title, voucher }) => `
        <div class="col">
          <div title="${title}" class="card mt-4 border-0 w-100 cursor-pointer position-relative border-0 prod-card">
            <div class="position-relative">
              <img src="${productImage}" class="card-img-top" alt="${title}">
              ${
                voucher
                  ? `<div class="position-absolute top-0 start-0 end-0 bottom-0">
                <img src="${voucher}" width="100%" alt="...">
              </div>`
                  : ''
              }
            </div>
            <div class="card-body">
              <div class="line-2-3dot min-h-24px user-select-none text-[1.2rem] lh-12px h-24 mb-24px">${title}</div>
              <div class="d-flex align-items-center justify-content-between">
                <div class="flex-grow-1 text-primary fs-3 d-flex align-items-center user-select-none">
                  <span class="fs-6">₫</span>
                  ${price}
                </div>
                <div class="text-[1.2rem] text-secondary">Đã bán ${sold}</div>
              </div>
            </div>
           ${
             discount && discount > 0
               ? `<div class="discount">
           <p class="text-white"><span class="percent">${discount > 100 ? 100 : discount}%</span> <br> Giảm</p>
         </div>`
               : ''
           }
          </div>
        </div>
      `
      )
    );
  },

  handleValidateInput(element, showError, type = 'text') {
    const valueInput = element.val();
    if (valueInput) {
      showError.text('');
      if (type === 'number') {
        if (regNumber.test(valueInput)) {
          showError.text('');
          if (valueInput?.length === 10) {
            showError.text('');
          } else {
            showError.text('Số điện thoại có 10 chữ số.');
            return false;
          }
        } else {
          showError.text('Trường này phải là số.');
          return false;
        }
      }
    } else {
      showError.text('Bạn phải nhập trường này.');
      return false;
    }

    return true;
  },

  handleValidateOnBlur(element, showError, type = 'text') {
    element.on('blur', () => {
      this.handleValidateInput(element, showError, type);
    });
  },

  handleToggleModal() {
    const keyLocal = this.LOCAL_STORAGE_DATA_USER;
    const that = this;
    const hasError = this.handleValidateInput;
    btn.click(function () {
      if (hasError(inputNumberPhone, showError, 'number')) {
        const randomPass = getRandomInt(100000, 999999);
        that.localStorage.set(keyLocal, {
          users: {
            phone: inputNumberPhone.val(),
            password: randomPass,
          },
        });
        yourPhone.text(inputNumberPhone.val());
        yourPass.text(randomPass);
        modal.show();
      }
    });
    span.click(function () {
      modal.hide();
    });
    $(window).on('click', function (e) {
      if ($(e.target).is('.modal')) {
        modal.hide();
      }
    });
  },

  handleClickLogin() {
    const that = this;
    const hasError = this.handleValidateInput;
    const user = this.localStorage.get(this.LOCAL_STORAGE_DATA_USER);

    btnLogin.click(() => {
      const isErrorPhone = hasError(inputPhoneLogin, showErrorPhoneLogin, 'number');
      const isErrorPassword = hasError(inputPasswordLogin, showErrorPassLogin);

      if (isErrorPhone && isErrorPassword) {
        const { phone, password } = user.users;
        if (phone === inputPhoneLogin.val() && `${password}` === inputPasswordLogin.val()) {
          that.localStorage.set(that.LOCAL_IS_USER_LOGIN, true);
          statusLogin.html(`<span class="text-success">Đăng nhập thành công.</span>`);
          setTimeout(() => {
            document.location.href = '/index.html';
          }, 2000);
        } else {
          statusLogin.html(`<span class="text-primary">Số điện thoại hoặc mật khẩu không đúng.</span>`);
          that.localStorage.set(that.LOCAL_IS_USER_LOGIN, false);
        }
      }
    });
  },

  checkLogin() {
    $(() => {
      const isLogin = this.localStorage.get(this.LOCAL_IS_USER_LOGIN);
      const user = this.localStorage.get(this.LOCAL_STORAGE_DATA_USER);
      if (isLogin) {
        userLogin.html(`
          <li class="nav-item d-flex align-items-center"> 
            <div class="text-white text-[1.4rem]">${user.users.phone || 0}</div>
          </li>
          <li class="nav-item d-flex align-items-center"> 
            <button class="bg-transparent border-none btn text-white text-[1.4rem]" id="btn-logout">Đăng xuất</button>
          </li>
        `);
      } else {
        userLogin.html(`
        <li class="nav-item"><a href="./register.html">Đăng Ký</a></li>
        <li class="nav-item space"><a href="./login.html">Đăng nhập</a></li>
      `);
      }
    });
  },

  handleClickBtnLogout() {
    const that = this;
    $(() => {
      const btnLogout = $('#btn-logout');

      btnLogout.click(() => {
        that.localStorage.set(that.LOCAL_IS_USER_LOGIN, false);
        document.location.reload();
      });
    });
  },

  init() {
    this.checkLogin();
    this.renderProducts();
    this.handleValidateOnBlur(inputNumberPhone, showError, 'number');
    this.handleValidateOnBlur(inputPhoneLogin, showErrorPhoneLogin, 'number');
    this.handleValidateOnBlur(inputPasswordLogin, showErrorPassLogin, 'text');
    this.handleToggleModal();
    this.handleClickLogin();
    this.handleClickBtnLogout();
  },
};

app.init();
