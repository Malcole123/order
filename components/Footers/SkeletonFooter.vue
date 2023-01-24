<template>
    <div class="app-footer app-container-fluid">
      <div class="website-footer">
          <div class="app-flex app-md-spacing">
            <AppLogo/>
          </div>
          <div>
              <span class="app-flex app-md-spacing">
                  <span>Copyright 2022 All Rights Reserved</span>
              </span>
          </div>
      </div>
  </div>
</template>

<script>
import AppLogo from '../Branding/AppLogo.vue';
export default {
  components:{
      AppLogo,
  }
}
</script>

<style scoped>
  .app-footer{
      width:100%;
      height:fit-content;
      background:var(--app-prim-light);
      border-top:0.1px solid var(--app-platinum)
  }

  .app-footer-container{
      display:grid;
      grid-template-columns:repeat(2,1fr);
      gap:1em;
      padding-top:2em;
      padding-bottom:2em;
  }

  .app-footer-navlinks{
      display:grid;
      grid-template-columns:repeat(2,1fr);
      gap:1em;
  }

  .app-footerlinks-wrapper{
      display:flex;
      flex-direction:column;
      gap:1.2em;
  }

  .app-footer-navlink , .website-footer-link{
      text-decoration:none;
      color:var(--app-prim-black);
      font-size:var(--app-text-base);
      padding-top:1em;
      padding-bottom:1em;
      text-transform:capitalize;
  }

  .website-footer{
      width:100%;
      padding:1em 0em;
      border-top:0.1px solid var(--app-platinum);
      display:flex;
      justify-content:space-between;
      align-items:center;
  }

  @media (max-width:992px) {
      .app-footer-container{
          display:grid;
          grid-template-columns:1fr;
          gap:1em;
      }

      .website-footer{
          flex-direction:column;
      }
  }
</style>