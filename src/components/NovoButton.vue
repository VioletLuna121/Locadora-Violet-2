<template>
  <q-btn
    label="Novo"
    icon="add"
    text-color="black"
    class="NovoButton"
    dense
  />
</template>

<script setup>

</script>

<style>
.NovoButton{
  border-radius: 15px;
  width: 90px;
  border: 1px solid black;
  box-shadow: 1px 3px 3px rgba(0, 0, 0, 0.479);
  height: 38px;
  background-color: #b3eef1;

}

.NovoButton.q-btn__content{
  font-size: 40px;
}
</style>
