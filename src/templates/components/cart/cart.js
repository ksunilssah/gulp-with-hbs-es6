class Cart {
    constructor($scope) {
        this.productList = {
            "subTotal": 11.96,
            "vat": 2.39,
            "totalCost": 14.35,
            list: [{
                    "productId": 1,
                    "name": "Cotton T-Shirt, Medium",
                    "price": 1.99,
                    "cost": 1.99,
                    "quantity": 1,
                }, {
                    "productId": 2,
                    "name": "Baseball Cap, One Size",
                    "price": 2.99,
                    "cost": 5.98,
                    "quantity": 2,
                },
                {
                    "productId": 3,
                    "name": "Swim Shorts, Medium",
                    "price": 3.99,
                    "cost": 3.99,
                    "quantity": 1,
                }
            ]
        };
        this.ui = this.getUiElments($scope);
        this.bindEvents();
    }
    //All selectors should be defined here.
    getUiElments(scope) {
        return {
            form: scope.find('form'),
            productSection: scope.find('.product-row'),
            removeButton: scope.find('.delete'),
            subTotal: scope.find('.sub-total'),
            vat: scope.find('.vat'),
            totalCost: scope.find('.total-cost'),
            inputElmn: scope.find('.count'),
            incrementBtn: scope.find('.increment'),
            decrementBtn: scope.find('.decrement'),

        }
    }

    bindEvents() {

        //Delete Button click binding
        this.ui.removeButton.on('click', (e) => {
            let _this = $(e.target),
                pId = _this.data('pid');
            this.productList.list = this.productList.list.filter((item) => {
                if (item.productId != pId) {
                    return true
                }
            });
            _this.parents('.row').remove();
            this.updatePrice();
            e.preventDefault();
        });

        //on + btn click update value 
        this.ui.incrementBtn.on('click', (e) => {
            e.preventDefault();
            let _this = $(e.target),
                inputElmn = _this.parents('.row').find('.count'),
                inputValue = parseInt(inputElmn.val()),
                count = 0;
            if (inputValue < 10) {
                count = inputValue + 1;
                inputElmn.val(count);
                this.updateRowData(_this, count);
            }
        });

        //on - btn click update value 
        this.ui.decrementBtn.on('click', (e) => {
            e.preventDefault();
            let _this = $(e.target),
                inputElmn = _this.parents('.row').find('.count'),
                inputValue = parseInt(inputElmn.val()),
                count = 0;
            if (inputValue > 1 && inputValue <= 10) {
                count = inputValue - 1;
                inputElmn.val(count);
                this.updateRowData(_this, count);
            }
        });

        //Input field change event binding
        this.ui.inputElmn.on('change', (e) => {
            let _this = $(e.target),
                elmnValue = parseInt(_this.val()),
                cost = 0;
            if (elmnValue >= 1 && elmnValue <= 10) {
                _this.removeClass('error');
                this.updateRowData(_this, elmnValue);
            } else {
                _this.addClass('error');
            }

        })

        //Print output in console
        this.ui.form.on('submit', (e) => {
            e.preventDefault();
            // console.log(this.productList);
            fetch('http://localhost:8082', {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify(this.productList)
                })
                .then(res => res.json())
                .then(dataObj => alert(this.productList))
                .catch(error => console.log(error));
        })
    }

    //Update row data
    updateRowData(elmn, count) {
        let _this = elmn,
            pId = _this.parents('.row').find('.delete').data('pid'),
            cost = 0;
        this.productList.list.filter((item) => {
            if (item.productId == pId) {
                item.quantity = count;
                cost = item.price * count;
                item.cost = cost.toFixed(2);
            }
        });

        _this.parents('.row').find('.t-cost').text(cost.toFixed(2));
        this.updatePrice();
    }

    updatePrice() {
        let subTotal = 0,
            vat = 0,
            finalPrice = 0;
        this.productList.list.map((item) => {
            subTotal = subTotal + item.price * item.quantity;
        });
        vat = (subTotal * 20) / 100;
        finalPrice = subTotal + vat;

        //Update Object with final data
        this.productList.vat = vat.toFixed(2);
        this.productList.subTotal = subTotal.toFixed(2);
        this.productList.totalCost = finalPrice.toFixed(2);

        this.updateUI({
            vat,
            subTotal,
            finalPrice
        });
    }


    updateUI(costObj) {
        if (costObj) {
            this.ui.vat.text(costObj.vat.toFixed(2));
            this.ui.subTotal.text(costObj.subTotal.toFixed(2));
            this.ui.totalCost.text(costObj.finalPrice.toFixed(2));
        }

    }
}

if ($('.cart').length) {
    const cart = new Cart($('.cart'));
}