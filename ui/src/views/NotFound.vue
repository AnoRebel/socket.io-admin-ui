<template>
  <div class="container fh5co-container">
    <div class="row">
      <div class="col-md-12 animate__animated animate__fadeInDownBig animate__fast">
        <div class="fh5co-404-wrap" id="video">
          <div class="overlay"></div>
        </div>
      </div>
      <div
        class="col-md-12 text-center fh5co-404-text animate__animated animate__fadeIn animate__fast"
      >
        <h2>Looks like you got lost</h2>
        <p>
          <router-link :to="{ name: 'Home' }" class="btn btn-primary">Go back home</router-link>
        </p>
      </div>
      <div
        class="col-md-12 text-center fh5co-copyright animate__animated animate__fadeInUpBig animate__fast"
      >
        <p><small>&copy; All Rights Reserved.</small></p>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
a {
  color: #1aa59a;
  -moz-transition: all 0.3s ease;
  -o-transition: all 0.3s ease;
  -webkit-transition: all 0.3s ease;
  -ms-transition: all 0.3s ease;
  transition: all 0.3s ease;
}
a:hover {
  color: #137971;
}

.fh5co-container {
  margin-top: 50px;
}

.fh5co-404-wrap {
  background: url("/imgs/1hero-bg.jpg") no-repeat center center;
  background-size: cover;
}

.overlay {
  background: url("/imgs/404.svg") no-repeat center center;
  background-size: cover;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  padding-left: 30px;
  padding-right: 30px;
  z-index: 2;
}
.overlay:after,
.overlay:before {
  content: "";
  background: #ffffff;
  height: 100%;
  top: 0;
  position: absolute;
  height: 100%;
  z-index: 10;
  width: 20px;
}
.overlay:before {
  left: 0;
}
.overlay:after {
  right: 0;
}

#video {
  position: relative;
  height: 540px;
  width: 100%;
}
@media screen and (max-width: 768px) {
  #video {
    height: 400px;
  }
}
@media screen and (max-width: 480px) {
  #video {
    height: 200px;
  }
}

.fh5co-404-text h2 {
  margin-bottom: 30px;
}
@media screen and (max-width: 480px) {
  .fh5co-404-text h2 {
    font-size: 18px;
  }
}

.fh5co-copyright {
  margin-top: 50px;
}

.btn-primary {
  border: none;
  background: #1aa59a;
  color: #ffffff;
  padding: 10px 20px;
  font-size: 18px;
}
.btn-primary:hover,
.btn-primary:active,
.btn-primary:focus {
  background: #21d1c3 !important;
}
</style>
