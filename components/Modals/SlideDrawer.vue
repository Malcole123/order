<template>
    <div :class="class_.pClass">
            <div  class="app-modal-container">
                <div :class="class_.aClass">
                    <div class="app-modal-body">
                       <slot name="slide_draw_body_full">
                        <div class="app-container-fluid full-width app-flex app-flex-between-row app-modal-header">
                            <span>
                                <span class="app-modal-heading">
                                    {{ modalTitle }}
                                </span>
                            </span>
                            <slot name="close_btn">
                                <MazBtn size="mini" color="black" @click="$emit('hideModal')" :loading="loading">Close</MazBtn>
                            </slot>
                        </div>
                        <div class="full-width app-modal-body-body">
                            <slot name="modal_body">

                            </slot>
                        </div>
                        <div class="full-width app-container-fluid app-modal-body-footer">
                            <slot name="footer_btn">

                            </slot>
                        </div>

                       </slot>
                    </div>
                </div>
            </div>
    </div>
</template>

<script>
export default {
    props:[
        'showModal',
        'showCloseLoading',
        'modalTitle',
        'slidePos',
        'modalSize',
    ],
    emits:[
        'modalOpened',
        'modalClosed',
        'hideModal'
    ],
    data(){
        return {
            class_: {
                pClass:"app-modal-wrapper",
                aClass:"app-modal-activity-area",
            },
            loading:false,
        }
    },
    computed:{
     
    },
    mounted(){
        this.loading = this.showCloseLoading;
    },
    watch:{
        showModal(newVal,oldVal){
            this.updateClass(newVal)
        },
        showCloseLoading(newVal,oldVal){
            this.loading = newVal;
        }
    },
    methods:{
        updateClass(val){
            let pClassArr = [ 'app-modal-wrapper'];
            let aClassArr = ['app-modal-activity-area', ];

            if(this.modalSize === 'sml'){
                aClassArr.push('app-modal-activity-area-sml')
            }

            if(this.slidePos === 'left'){
                aClassArr.push('app-modal-activity-left')
            }else{
                aClassArr.push('app-modal-activity-right')
            }

         
            if(val === true){
                pClassArr.push("app-modal-wrapper-active");
            }
            let emit_ = val === true ? 'modalOpened' : 'modalClosed';
            this.$emit(emit_);
            this.class_.aClass = aClassArr.join(' ');
            this.class_.pClass = pClassArr.join(' ')
        },
        reqClose(){
            this.$emit('hideModal')
        }
    }
}
</script>

<style scoped>
    .app-modal-wrapper{
        height:100%;
        width:100%;
        background:rgba(0,0,0,0.75);
        position:fixed;
        top:0;
        left:0;
        right:0;
        bottom:0;
        display:none;
        z-index:9999;
    }

    .app-modal-wrapper-active{
        display:block
    }

    .app-modal-container{
        width:100%;
        height:100%;
        position:relative;
    }

    .app-modal-activity-area{
        height:100%;
        width:40%;
        position:absolute;
        top:0;
        background:var(--app-prim-light);
        transition:0.4s ease-in-out;
        padding-top:0.5em;
    }

    .app-modal-activity-area-sml{
        width:25%;
    }


    .app-modal-activity-right{
        right:-40%;
    }


    .app-modal-activity-left{
        left:-40%;
    }


   .app-modal-wrapper-active .app-modal-activity-left{
        animation:showModalLeft 0.2s linear forwards
   }

   .app-modal-wrapper-active .app-modal-activity-right{
        animation:showModalRight 0.2s linear forwards
   }
    

    @keyframes showModalRight {
        0%{
            right:-40%;
        }
        100%{
            right:0%;
        }
    }

    @keyframes showModalLeft {
        0%{
            left:-40%;
        }
        100%{
            left:0%;
        }
    }



    .app-modal-body-header{
        width:100%;
        border-bottom:0.1px solid var(--app-platinum);
    }




    .app-modal-heading{
        font-size:var(--app-text-xl);
        font-weight:600;
        font-family:var(--app-heading-font);
    }

    .app-modal-body{
        width:100%;
        height:100%;
        display:flex;
        flex-direction:column;
        position:relative;
        gap:0.3em;
    }

    .app-modal-body-header, .app-modal-body-body{
        width:100%;
    }

    .app-modal-body-body{
        flex:1;
        width:100%;
        height:90%;
        overflow-y:scroll;
        padding-bottom:10%;
    }

    .app-modal-body-footer{
        height:12%;
        width:100%;
        position:absolute;
        bottom:0;
        left:0;
        border-top:0.1px solid var(--app-platinum);
        display:flex;
        align-items:center;
        background:var(--app-prim-light);
        z-index:5;
    }

    .app-modal-body-footer > * {
        width:100%;
    }

    @media (max-width:992px) {
        
        .app-modal-activity-area{
            height:100%;
            width:90%;
        }

        .app-modal-activity-area-sml{
            width:55%;
        }

        .app-modal-activity-right{
            right:-90%;
        }

        .app-modal-activity-left{
            left:-90%;
        }

    @keyframes showModalRight {
        0%{
            right:-90%;
        }
        100%{
            right:0%;
        }
    }

    @keyframes showModalLeft {
        0%{
            left:-90%;
        }
        100%{
            left:0%;
        }
    }



        @keyframes showModal {
            0%{
                right:-90%;
            }
            100%{
                right:0%;
            }
        }
    
    }
</style>