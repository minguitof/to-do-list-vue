<script setup>
// En <script setup> no necesitas registrar componentes, 
// solo impórtalos y úsalos. ¡Es magia!
import Board from './components/Board.vue';
import Settings from './components/Settings.vue';
</script>

<template>
  <h1 class="rainbow-text">Lista To-Do-List</h1> 
      
  <div class="main-container">
    <Settings />
    
    <div class="column-container">
      <Board />
    </div>
  </div> 
</template>

<style>
@import '@/assets/styles/App.css';
</style>