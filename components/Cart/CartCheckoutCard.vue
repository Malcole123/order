<template>
    <div class="cart-checkout-card component-padding">
        <div class="full-width checkout-card-content">
            <span>
                <span class="checkout-card-title">{{ title }}</span>
            </span>
            <span>
                <p class="checkout-card-description">
                    {{ desc }}
                </p>
            </span>
            <span>
                <p class="checkout-card-description">
                    <span>{{ `${select_value} x ${price_str}` }} | <span class="checkout-card-price">{{ total_price_str }}</span></span>
                </p>
            </span>
        </div>
        <div class="full-width">
            <MazSelect
            :placeholder="'Quantity'"
            :options="quantitySel"
            :listWidth="'100%'"
            v-model="select_value"
            color="dark"
            @input="updateUserQuantity"

            />
        </div>
    </div>
</template>

<script>
export default {
    emits:[
        'valueChanged'
    ],
    props:[
        'index',
        'data_id',
        'title',
        'desc',
        'quantity',
        'price'
    ],
    data(){
        return {
            quantitySel:[
                { label: 'remove', value:0},
                { label: '1', value: 1 },
                { label: '2', value: 2 },
                { label: '3', value: 3 },
                { label: '4', value: 4 },
                { label: '5', value: 5 },
                { label: '6', value: 6 },
                { label: '7', value: 7 },
                { label: '8', value: 8 },
            ],
            select_value:null,
            price_str:"",
            total_price_str:"",
        }
    },
    watch:{
        quantity(newVal,oldVal){
            if(typeof newVal === 'number'){
                this.select_value = newVal;
                this.calculateTotals()
                return 
            }
        },
        price(newVal,oldVal){
            this.calculateTotals();
        },

    },  
    mounted(){
        this.select_value = this.quantity || 1;
        if(this.price === undefined){ return }
        this.calculateTotals(); //Calculate card totals
        if(this.quantity !== null){
            for(let i = 9 ; i <= 40; i++){
                let create_ = this.createQuantityLabel({label:`${i}`,value:i});
                this.quantitySel.push(create_)
            }
        }
    },
    methods:{
        createQuantityLabel({label,value}){
            let obj_ = {
                label,
                value,
            };
            return obj_
        },
        updateUserQuantity(val){
            this.$emit('valueChanged', {
                index:this.index,
                id:this.data_id,
                value:val,
            })
        },
        moneyFormatter({currency, amount}){
            let formatter = new Intl.NumberFormat('en-us', {style:'currency', currency:currency});
            return  formatter.format(amount);
        },
        calculateTotals(){
            this.price_str = this.moneyFormatter({currency:this.price.currency, amount:this.price.amount});
            let quant_total = this.price.amount * this.select_value;
            this.total_price_str = this.moneyFormatter({currency:this.price.currency, amount:quant_total})
        }
    }
}
</script>

<style scoped>
    .cart-checkout-card{
        width:100%;
        background:var(--app-prim-light);
        display:grid;
        grid-template-columns:3fr 1fr;
    }

    .checkout-card-content{
        width:100%;
        display:flex;
        flex-direction:column;
        gap:0.2em;
    }

    .checkout-card-title{
        font-size:var(--app-text-lg);
        font-weight:600;
    }

    .checkout-card-description{
        font-size:var(--app-text-xs);
    }

    .checkout-card-price{
        font-weight:700;
    }
</style>