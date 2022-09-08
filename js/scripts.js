class Validator {

    constructor() {
        this.validations = [
            'data-required',
            'data-min-length',
            'data-max-length',
            'data-email-validate',
            'data-only-letters',
            'data-equal',
            'data-password-validate',
        ]
    }

    // iniciar a validação de todos os campos
    validate(form) {

        // resgata todas as validações
        let currentValidations = document.querySelectorAll('form .error-validation');

        if(currentValidations.length > 0) {
            this.cleanValidations(currentValidations);
        }

        // pegar os inputs
        let inputs = form.getElementsByTagName('input');

        // transformo HTMLCollection -> array
        let inoutsArray = [...inputs];

        // loop nos inputs e validação mediante ao que for encontrado
        inoutsArray.forEach(function(input) {
            
            // loop em todas as validações existentes
            for(let i = 0; this.validations.length > i; i++) {
               // verifica se a validação atual existe no input
                if (input.getAttribute(this.validations[i]) != null) {
                
                    // limpando a string para virar um metodo
                    let method = this.validations[i].replace('data-', '').replace('-', '');

                    // valor do input
                    let value = input.getAttribute(this.validations[i]);

                    // invocar o metodo
                    this[method](input, value);

               } 
            }

        }, this);

    }

    // verifica se um input tem um numeri minimo de caracteres
    minlength(input, minValue) {

        let inputLength = input.value.length;

        let errorMassage = `O campo precisa ter pelo menos ${minValue} caracteres`;

        if(inputLength < minValue) {
            this.printMessage(input, errorMassage);
        }

    }

    // verifica se um input passou do limite de caracteres
    maxlength(input, maxValue) {
        
        let inputLength = input.value.length;

        let errorMassage = `O campo precisa ter menos que ${maxValue} caracteres`;

        if(inputLength > maxValue) {
            this.printMessage(input, errorMassage);
        }

    }

    // valida emails
    emailvalidate(input) {

        // email@email.com
        let re = /\S+@\S+\.\S+/;

        let email = input.value;

        let errorMassage = 'Insira um e-mail no padrão nome@email.com';

        if(!re.test(email)) {
            this.printMessage(input, errorMassage);
        }

    }

    // valida se o campo tem apenas letras
    onlyletters(input) {

        let re = /^[A-Za-z]+$/;

        let inputValue = input.value;

        let errorMassage = 'Este campo não aceita números nem caracteres especiais';

        if(!re.test(inputValue)) {
            this.printMessage(input, errorMassage);
        }

    }

    // metodo para imprimir mensagem de erro na tela
    printMessage(input, msg) {

        // quantidade de erros
        let errorsQty = input.parentNode.querySelector('.error-validation');

        if(errorsQty === null) {
            let template = document.querySelector('.error-validation').cloneNode(true);

            template.textContent = msg;

            let inputParent = input.parentNode;

            template.classList.remove('template');

            inputParent.appendChild(template);
        }

    }

    // verifica se o input é requerido
    required(input) {

        let inputValue = input.value;

        if(inputValue === '') {
            let errorMassage = 'Este campo é obrigatorio';

            this.printMessage(input, errorMassage);
        }

    }

    // verifica se dois campos são iguais
    equal(input, inputName) {

        let inputToCompare = document.getElementsByName(inputName)[0];

        let errorMassage = `Este campo precisa esta igual ao ${inputName}`;

        if(input.value != inputToCompare.value) {
            this.printMessage(input, errorMassage);
        }

    }

    // valida o campo da senha
    passwordvalidate(input) {

        // explodir string em um array
        let charArr = input.value.split('');

        let uppercases = 0;
        let numbers = 0;

        for(let i = 0; charArr.length > i; i++) {
            if(charArr[i] === charArr[i].toUpperCase() && isNaN(parseInt(charArr[i]))) {
                uppercases++;
            } else if(!isNaN(parseInt(charArr[i]))) {
                numbers++;
            }
        }

        if(uppercases === 0 || numbers === 0) {
            let errorMassage = 'A senha precisa de um caractere minúsculo e um número';

            this.printMessage(input, errorMassage);
        }

    }

    // limpa as validações da tela
    cleanValidations(validations) {
        validations.forEach(el => el.remove());
    }

}


let form = document.getElementById('register-form');
let submit = document.getElementById('btn-submit');

let validator = new Validator();

// evento que dispara as validações
submit.addEventListener('click', function(e) {

    e.preventDefault();

    validator.validate(form);

});