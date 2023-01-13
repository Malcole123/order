<template>
    <MainWrapper>
      <template v-slot:navbar>
          <ApplicationNavbarVue/>
      </template>
      <template v-slot:body>
    
      </template>
    </MainWrapper>
 
</template>

<script>
import ApplicationNavbarVue from '~/components/Navbars/ApplicationNavbar.vue';
import MainWrapper from '~/components/Wrapper/MainWrapper.vue';
import SquareDisplayCard from '~/components/Cards/DisplayCards/SquareDisplayCard.vue'
export default {
  auth:false,
  name: 'StorePage',
  head(){
    return {
      title:"",
    }
  },
  components:{
    MainWrapper,
    ApplicationNavbarVue,
    SquareDisplayCard,
  }
}
</script>
