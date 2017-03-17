<template>

    <div class="row" style="margin: 0 0 10px -30px;">
        <div class="col-md-12">
            <img src="../assets/blockchain.png" alt="blockchain height">
            <span class="blue-span" style="margin-right: 24px;">{{ blockchainHeight }}</span>
            <img src="../assets/clock.png" alt="count down">
            <span class="blue-span">{{ time }}</span>
        </div>
    </div>

</template>

<script>

	export default {
		data() {
			return {
				time: 0,
				blockchainHeight: NaN
			}
		},

		methods: {
			run() {
				refreshCount = setInterval(() => {
					this.time++;
					console.log(this.blockchainHeight);

					let temp = this.blockchainHeight;
					console.log(temp);

					this.blockchainHeight = this.getHigh();
					console.log(this.blockchainHeight);

					if (temp !== this.blockchainHeight) {
						this.time = 0;
					}
				}, 1000);
			},
			getHigh() {
				this.$http.get('block/count/').then(res => res.data.height);
			}
		},

		mounted() {
			this.run();
		},

		destroyed() {
			clearInterval(refreshCount);
			console.log('Destroyed the count')
		}
	};

	let refreshCount;

</script>

<style lang="css" scoped>


</style>