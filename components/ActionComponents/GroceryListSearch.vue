<template>
    <div class="grocery-list-component-wrapper">
        <div class="grocery-list-component-container">
            <div class="grocery-list-component-header app-container-fluid">
                <span class="app-flex app-flex-column">
                    <span>
                        <span class="grocery-list-main-heading">Create Your List</span>
                    </span>
                    <p class="grocery-list-main-subtitle"></p>
                </span>
                <span>
                    <span>
                        <slot name="header_slot_right"></slot>
                    </span>
                </span>
            </div>
            <div class="grocery-list-component-input app-container-fluid">
                <div class="full-width">
                    <MazInput 
                    v-model="input"
                    color="black"
                    :placeholder="state.input_placeholder"
                    :loading="state.input_loading"
                    :autocomplete="false"
                    style="border-color:black"
                    @keyup="itemAddDetect"
                    >
            <template v-slot:icon-right>
                <MazBtn 
                color="black" 
                size="mini"
                :loading="state.input_loading"
                @click="addFromInput"
                :focus="true"
                >
                    Add
                </MazBtn>
            </template>
                
                    </MazInput>
                </div>
                <div class="full-width" style="height:100%">
                    <MazBtn 
                    :color="state.mic_color"
                    size="mini"
                    :loading="state.mic_loading"
                    style="height:100%;width:100%;text-transform:capitalize;"
                    @click="toggleSpeech"
                    :id="`mic_toggle_btn_main`"
                    >
                    <span class="speak-microphone">
                        <span class="material-symbols-outlined">
                           {{ state.mic_icon }}
                        </span>
                    </span>
                    </MazBtn>
                </div>
            </div>
            <div class="grocery-list-component-body" id="grocery_list_scroll_component">
                <div class="grocery-list-component-body-container app-container-fluid">
                    <MazList
                    :noShadow="true"
                    :bordered="false"
                    :noScroll="true"
                    :transition="true"
                    >
                        <MazListItem v-for="(result, index) of add_list" :key="`card-item-${index}`" style="padding:5px 0px;border:none;">
                            <div class="grocery-list-component-card">
                                <div class="grocery-card-container">
                                    <div class="full-width">
                                        <MazInput 
                                        v-model="result.text"
                                        placeholder=""
                                        :dark="true"
                                        :noLabel="true"
                                        style="background:black"
                                        color="grey"
                                        />
                                    </div>
                                    <div class="full-width" style="display:flex;height:100%;justify-content:flex-end;align-items:center;">
                                        <div class="grocery-card-icon" @click="removeResult(index)">
                                            <span class="material-symbols-outlined">
                                                delete
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </MazListItem>
                    </MazList>
                    <div class="full-width"  v-if="add_list.length > 0">
                        <MazBtn 
                        size="lg"
                        style="width:100%"
                        color="black"                     
                        >
                        Search {{ add_list.length }} Items
                        </MazBtn>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
export default {
    props:[
        'subTitle'
    ],
    data(){
        return {
            input:"",
            state:{
                mic_icon:'mic',
                mic_color:'primary',
                mic_loading:false,
                input_loading:false,
                input_placeholder:'Add names of grocery items ...'
            },
            permissions:{
                mic_allowed:false,
                camera_allowed:false,
            },
            listening:false,
            add_list:[],
            listener:{
                accuracy:90, //Accuracy for grammar detection
                result:{
                    lastSetIndex:0,
                },
                stop:{},
                abort:(val)=>{
                    if(typeof val !== 'function'){ return }
                    val()
                },
            }
        }
    },
    methods:{
        toggleSpeech(){
            var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
            this.state.mic_loading = true;
            if(this.listening === true){
                
            }else{
                this.initiateSpeechRecognize()
            }
        },
        addFromInput(){
            if(this.input.length === 0){ return };
            this.state.input_loading = true;
            this.userDelayAction(()=>{
                this.addListItem({
                    text:this.input,
                    type:'input',
                });
                this.input = "";
                this.state.input_loading = false;
            }, 900)
          
        },
        addListItem({text,type}){
            text = text.toLowerCase();
            this.add_list.push({type,text});
            this.add_list.filter((item,index)=>{
                if(item.text.length > 0){
                    return item 
                }
            })
            this.userDelayAction(()=>{
                this.scrollContainerFull()
            },400)
        },
        removeResult(index){
            this.add_list = [...this.add_list].filter((item,i)=>{
                if(i !== index){
                    return item ;
                }
            })
        },
        userDelayAction(callback, time){
            setTimeout(()=>{
                callback();
                return 
            }, time);
             return 
        },
        async userMediaPermissionsEnforce(){
            let stream = null;
            try {
                stream = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                });
                this.permissions.mic_allowed = true;
                return true
                /* use the stream */
            } catch (err) {
                /* handle the error */
                this.permissions.mic_allowed = false;
                return false
            }
        },
        async initiateSpeechRecognize(){
            let req = await this.userMediaPermissionsEnforce();
            if(req === false){ return }
            var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
            var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
            var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;
            const words = [
                'Bread',
                'Rice',
                'Meat'
            ];
            var grammar = '#JSGF V1.0; grammar phrase; public <phrase> = ' + words +';';
            //
            var recognition = new SpeechRecognition();
            var speechRecognitionList = new SpeechGrammarList();
            speechRecognitionList.addFromString(grammar, 1);
            recognition.grammars = speechRecognitionList;
            recognition.lang = 'en-US';
            recognition.interimResults = false;
            recognition.continuous  = true;
            recognition.maxAlternatives = 1;
            const recAccuracy = 80;
            const setMicState = this.setMicState;
            const successHandler = this.speechSuccessHandle;
            let initBtn = document.getElementById('mic_toggle_btn_main')           
            //Functions
            recognition.onaudiostart = function(event) {
                //Fired when the user agent has started to capture audio.
                
        
            }
            
            recognition.onaudioend = function(event) {
            
            }

            recognition.onstart = function(event) {
                //Fired when the user agent has started to capture audio.
                try{
                    
                    setMicState({
                        icon:'mic_off',
                        color:'danger',
                    });
                }catch(err){
                    console.log(err, 'err')
                }

            }

            recognition.onend = function(event){
                setMicState({
                    icon:'mic',
                    color:'primary',
                })
            }

            recognition.onresult = function(event){
                var speechResult = event.results;
                let speechText = speechResult[event.resultIndex][0];
                if(speechText.confidence >= recAccuracy){
                    successHandler(speechText.transcript);
                }else{
                    successHandler(speechText.transcript)
                }
            }


            recognition.onerror = function(event){
                //recognition.abort();
            }


            //Add event listener to expose window object to recognition to stop
            initBtn.addEventListener('click', (ev)=>{
                recognition.stop();
            })
            //Call
            recognition.start();
        },
        destroySpeechReconginze(){
            this.listening = false;
            this.state.mic_loading = falsee
        },
        setMicState({icon,color}){
            switch(icon){
                case "mic_off":
                    this.listening = true;
                    //Show off icon because listening
                    break
                case "mic":
                    this.listening = false;
                    //show bare icon because not listening
                    break
            }
            this.state.mic_icon = icon;
            this.state.mic_color = color;
            this.userDelayAction(()=>{
                this.state.mic_loading = false;
            },340)
        },
        speechSuccessHandle(result){
            //Get current list items to prevent adding duplicates
            let current_set_results = [...this.add_list].map((item,index)=>{
                return item.text.replaceAll(" ", "").toLowerCase();
            });
            let result_narrow = result.replaceAll(" ", "").toLowerCase();
            if(current_set_results.includes(result_narrow) === false && result.length > 0){
                this.addListItem({
                    text:result,
                    type:'voice',
                });
                this.listener.result.lastSetIndex = index;
                return
            }
        },
        itemAddDetect(ev){
            var key=ev.keyCode || ev.which;
                if (key==13){
                    if(this.input.length > 0 && this.state.input_loading === false){
                        this.addFromInput();
                        return 
                    }else{

                    }
                }
        },
        scrollContainerFull(){
            let el_ = document.getElementById('grocery_list_scroll_component');
            if(el_ === undefined || el_ === null){ return }
            el_.scrollTop = el_.scrollHeight + 400;
        }
    },
    watch:{
     
    }
}
</script>

<style scoped>
    .grocery-list-component-wrapper{
        height:fit-content;
        max-height:100%;
        width:100%;
    }

    .grocery-list-component-container{
        display:flex;
        flex-direction:column;
        height:100%;
    }

    .grocery-list-component-header{
        width:100%;
        display:flex;
        justify-content:space-between;
        align-items:center;
        gap:0.6em;
        position:absolute;
        top:0%;
        left:0%;
        height:8%;
    }

    .grocery-list-main-heading{
        font-size:var(--app-text-lg);
        font-weight:600;
        color:var(--app-prim-black)
    }

    .grocery-list-main-subtitle{
        font-size:var(--app-text-xs);
        color:var(--app-prim-black)
    }

    .grocery-list-component-input{
       height:10%;
       position:absolute;
       top:8%;
       left:0%;
       width:100%;
       display:flex;
       align-items:center;
       display:grid;
       grid-template-columns:7fr 1fr;
       gap:0.4em;
       padding-top:0.5em;
       padding-bottom:0.5em;
    }

    .grocery-list-component-body{
        width:100%;
        height:82%;
        overflow-y:scroll;
        scroll-behavior:smooth;
        position:absolute;
        top:18%;
        left:0%;
    }

    .grocery-list-component-body-container{
        height:fit-content;
        width:100%;
        padding-top:0.5em;
        padding-bottom:1em;
    }


    .grocery-list-component-body::-webkit-scrollbar{
        width:4px;
    }

    .grocery-list-component-body::-webkit-scrollbar-thumb{
        width:4px;
        background:var(--app-prim-black)
    }

    .grocery-list-component-body::-webkit-scrollbar-track{
        width:4px;
        background:var(--app-prim-light)
    }


    .grocery-list-component-card{
        padding:0.6em 0.4em;
        width:100%;
        border:2px solid var(--app-prim-black);
        border-radius:12px;;
        overflow:hidden;
        user-select:none;
    }

    .grocery-card-container{
        width:100%;
        height:fit-content;
        display:grid;
        grid-template-columns:7fr 1fr;
        gap:0.2em;
        border-radius:12px;;
    }

    .grocery-card-item-text{
        font-size:var(--app-text-base);
        font-weight:600;
        color:var(--app-prim-black);
        text-transform:capitalize;
    }

    .grocery-card-icon{
        border-radius:999px;
        background:var(--app-prim-black);
        padding:4px;
        display:flex;
        align-items:center;
        justify-content:center;
        user-select:none;
    }

    .grocery-card-icon .material-symbols-outlined{
        font-size:var(--app-text-xl);
        cursor:pointer;
        color:var(--app-prim-light)
    }

    .speak-microphone .material-symbols-outlined{
        font-size:calc(var(--app-text-xl) *1.25);
    }
</style>