const state = (()=>{
    return {
        user:{
            name:{
                first:"",
                last:"",
                alias:"",
            },
            email:"",
        },
        cart:{
            lastUpdated:0,
            changeSinceSync:false,
            cart_items:[]
        },
        orders:[],
    }
})


const getters = {
    getUserData(state){

    },
    getCartUpdatedTime(state){
        let cart_time = state.cart.lastUpdated;
        return cart_time
    },
    userCartItems(state){
        let cart_items = state.cart.cart_items;
        let cart_total = 0;
        [...cart_items].forEach((cart_item,index)=>{
            const { item  } = cart_item;
            let total = item.price.amount * item.quantity;
            let addon_arr = item.addons.map((addonItem,i)=>{
                return addonItem.quantity * addonItem.price.amount;
            })
            let addon_total = 0;
            if(addon_arr.length >= 1){
                addon_total = addon_arr.reduce((prevVal,nextVal)=>{return prevVal + nextVal})
            }
            let cart_item_total = total + addon_total
            cart_total = cart_total + cart_item_total;
        })
        return {
            cart_total,
            cart_items,
        };
    },
    seeMyOrders(state){
        let orders = state.orders;
        let filter_function = (status)=>{
            if(status === null || status.length === 0){
                return {
                    orders,
                    total:orders.length
                }
            }else{
                let filtered = [...orders].filter((item,index)=>{
                    if(item.status === status){
                        return item ;
                    }
                });
                 return {
                    total:orders.length,
                    orders:filtered,
                 }
            }
        }
        return filter_function;
    }

}


const mutations = {
    setUserFromLogin(state, { name , email }){
        state.user.name.first = name.first;
        state.user.name.last = name.last;
        state.user.name.alias = name.alias;
        state.user.email = email;
    },
    setUserCart(state, {cart_items}){
        if(cart_items.length === undefined ){ return }
        state.cart.lastUpdated = new Date().getTime();
        state.cart.cart_items = cart_items;
        state.changeSinceSync = false;
    },
    updateSingleCartItem(state, { id , quantity , remove, index}){
        try{
            state.cart.cart_items = state.cart.cart_items.map((item,index)=>{
                if(item.id === id){
                    item.item.quantity = quantity;
                    return item;
                }
                return item;
            });
            return true
        }catch(err){
            return false
        }
    },
    setMyOrderItems(state, { orders }){
        state.orders = orders;
        return true;
    }
 
  

}

const actions = {
    async userLogin(state, {email, password}){
        let res = await this.$auth.loginWith('local', { data:{
            email,
            password
        }});
        let return_ = {
            ok:false,
            message:"",
        }
        let status = 200;
        try {
            status = res.status;
            let data = res.data.user;
            return_.ok = true;
            return_.message = "Success !"
            state.commit('setUserFromLogin', data);
            return return_
        }catch(err){
            return_.message = status === 401 ? "Incorrect Email / Password" : "Something went wrong. Please try again";
            return return_
        }
    },
    async userRegister(state, {email, password, name}){
        let url = process.env.NUXT_ENV_SIGN_UP;
        let res = await this.$axios.$post(url , { 
            email,
            password, 
            name,
        }).then((data)=>{
            this.$auth.loginWith('local', {
                data:{
                    email:email,
                    password:password
                }
            })
            return {
                ok:true,
                data:data,
            }
        }).catch(err=>{
          return {
            ok:false
          }
        });

        return res
    },
    async getUserCart(state){
        let url = process.env.NUXT_ENV_GET_USER_CART;
        let dt = await this.$axios.$get(url , {progress:false}).then(async data=>{
            await state.commit('setUserCart', {
                cart_items:data.cart_items,
            });
            return {
                ok:true,
            }
        }).catch(err=>{
            return {
                ok:false
            }
        });
         return dt
    },
    async addCartItem(state, { product_reference , special_instruction, quantity, drink_selections, addons, variant_reference }){
        let url_ = process.env.NUXT_ENV_CART_ITEM_ADD_SINGLE;
        let request_ = this.$axios.$post(url_, {
            new_item:{
                product_reference,
                special_instruction,
                quantity,
                drink_selections,
                addons,
                selection_reference:variant_reference
            }
        }).then(data=>{
            state.commit('setUserCart', {
                cart_items:data.cart.cart_items,
            });
            return {
                ok:true
            }
        }).catch(err=>{
            return {
                ok:false
            }
        });
        return request_

    },
    async userCartCheckout(state , { delivery, fulfill_type, order_item_total, payment_method }){
        let url = process.env.NUXT_ENV_USER_CHECKOUT ;
        let dt = await this.$axios.$post(url, {
            delivery,
            fulfill_type,
            order_item_total,
            payment_method,
        }, {progress:false}).then(data=>{
            return {
                ok:true,
                transaction_reference:data.transaction_reference
            }
        }).catch(err=>{
            return {
                ok:false,
            }
        });
        return dt
    },
    async syncUserCartToDB(state){
        let cart_items = state.getters['userCartItems'].cart_items;
        let url_ = process.env.NUXT_ENV_USER_CART_SYNC;
        let returned_ = []
        cart_items.forEach((item,index)=>{
            let result_ = {
                id:item.id,
                item:{
                    quantity:item.item.quantity,
                    addons:[],
                }
            };
            returned_.push(result_)
        })
        let request_ = await this.$axios.$post(url_, {
            cart_item:returned_,
        }).then( async data=>{
            await state.commit('setUserCart', {
                cart_items:data.cart.cart_items,
            });
            return {
                ok:true
            }
        }).catch(err=>{
            return {
                ok:false
            }
        });
        return request_

    }, 
    checkCartItemPresence(state, { event_reference , selection_reference}){
        let items = state.getters['userCartItems'].cart_items;
        let event_found = items.filter((item,index)=>{
            let in_selection = item.tickets_selected.find((ticket,index)=>{
                if(ticket.selection_ref = selection_reference){
                    return item 
                }
            });
            if(in_selection !== undefined){
                return item;
            }
        });
        return event_found;
    },
    async getMyOrders(state){
        let url = process.env.NUXT_ENV_GET_MY_ORDERS;
        let res_ = await this.$axios.$get(url).then(data=>{
            state.commit('setMyOrderItems', {
                orders:data.orders
            })
            return {
                ok:true,
                data:data.orders,
            }
        }).catch(err=>{
            console.log(err)
            return {
                ok:false,
                data:null,
            }
        });
        return res_;
    },
}






export { state, getters, mutations, actions }