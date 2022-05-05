<script lang="ts">
	export let type = 'button';
	export let disabled = false;
</script>

<button {disabled} {type}><slot /></button>

<style lang="scss">
	button {
		@include style.button;
	}
</style>
