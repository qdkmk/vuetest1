<template>
<transition name="modal" appear>
  <div class="modal modal-overlay" @click="$emit('close')"  >
    <div class="modal-window">
      <div class="modal-content">
        <p class="question">{{question}}</p>
        <hr>
        <p class="answer">{{answer}}</p>
      </div>
      <router-link :to="{ name: 'detail', params:{sysid:this.id} }">
        <button type="button" class="button">詳細を見る</button>
        </router-link>
    </div>
  </div>
</transition>
</template>
<script>
export default {
  name: 'Modal',
  data() {
    return {
    }
  },
  props: {
    question:String,
    answer:String,
    id:String
  },
}

</script>

<style scoped>
.modal-overlay {
  display: flex;
align-items: center;
text-align: left;
justify-content: center;
  position: fixed;
  z-index: 30;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
    background: rgba(0, 0, 0, 0.5);
}

.modal-window {
  background: #fff;
  border-radius: 4px;
  width: 95%;
  height: 90%;
  overflow: auto;
  position: relative;
   text-align: center;
}

.modal-content {
  padding: 10px 20px;
  text-align: left;

}
.modal-content p{
  color: #000;
}
.modal-content .question{
font-size: 1.2rem;
line-height: 1.7rem;
letter-spacing: 0.02rem;
}
.modal-content .answer{
}
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s;
}

.modal-window {
    transition: opacity 0.3s, transform 0.2s;
  }



.modal-leave-active {
  transition: opacity 0.2s ease 0.2s;
}

.modal-enter,
.modal-leave-to {
  opacity: 0;
}
.modal-window {
    opacity: 1;
}
.button {
  margin: 10px auto 30px;
  width: 90%;
  display: inline-block;
  background-color: #f78200;
  color: #fff;
  font-size: 1.5rem;
  line-height: 1;
  text-decoration: none;
  letter-spacing: 0.05rem;
  padding: 0.5rem 1rem;
  border-radius: 3px;
  cursor: pointer;
  box-shadow: 0 3px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
  -webkit-tap-highlight-color: transparent;
  transition: .3s ease-out;
}

@media screen and (min-width: 768px) {
  .modal-window {
    width: 50%;
  }
  .modal-content .question{
  font-size: 1.3rem;
  line-height: 1.8rem;
  letter-spacing: 0.03rem;
  }
  .modal-content .answer{
    line-height: 1.6rem;
  }
  .button {
    width: auto;
  }
}
</style>
