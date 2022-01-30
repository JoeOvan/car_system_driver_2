<template>
	<view class="wrapper">
		<cu-custom bgColor="bg-white" :isBack="true">
			<block slot="backText">茂南石化工业园区车辆管理平台</block>
		</cu-custom>
		<block v-if="content">
			
			<view class="content">
				<block v-if="content.isNull==false">
					<view class="status-wrap" v-if="carStatus == 1 || carStatus == 2 || carStatus == 3">
						<view class="tips">
							<view>您好，<text class="phone">{{content.mobile}}</text>用户，您的排队号是：</view>
							<view class="status-logout" @click="logout"><image src="../../static/images/Logout.png" mode=""></image></view>
						</view>
						<view class="status-show">
							<view class="line-up-wrap">
								{{content.rankNum}}
							</view>
							<view class="text">前面还有<text class="strong">{{content.frontRankNum}}</text>辆车排队等候</view>
						</view>
						<view class="status-item">
							<text class="label">预计等候时间：</text>
							<view class="time">
								<uni-countdown :show-day="false" @timeup="timeup" :hour="countDownAwait.hour" :minute="countDownAwait.minute" :second="countDownAwait.second" />
							</view>
						</view>
						<view class="status-item">
							<text class="label">车辆入口信息：</text>
							<text class="entrance">铁路口</text>
						</view>
					</view>
					<view class="status-wrap" v-if="carStatus == 4">
						<view class="tips">
							<view>您好，<text class="phone">{{mobile}}</text>用户，您的园区作业倒计时：</view>
							<view class="status-logout" @click="logout"><image src="../../static/images/Logout.png" mode=""></image></view>
						</view>
						<view class="status-show">
							<view class="count-down-wrap" v-if="countDownTime.isShow">
								{{countDownTime.hour}}:{{countDownTime.minute}}:{{countDownTime.second}}
							</view>
							<view class="count-down-wrap" v-else>
								您已超时！
							</view>
							<text class="text">超时违规作业将被记录</text>
						</view>
						<view class="status-item">
							<text class="label">园区作业时间：</text>
							<text class="time">{{content.inputSystemTime}} - {{content.outSystemTime}}</text>
						</view>
						<view class="status-item">
							<text class="label">车辆出口信息：</text>
							<text class="entrance">铁路口</text>
						</view>
					</view>
					<view class="status-wrap" v-if="carStatus == 5">
						<view class="tips">
							<view>您好，<text class="phone">{{mobile}}</text>用户，您的园区作业：</view>
							<view class="status-logout" @click="logout"><image src="../../static/images/Logout.png" mode=""></image></view>
						</view>
						<view class="status-show">
							<view class="done-wrap">
								已完成
							</view>
							<text class="text">感谢您的配合！</text>
						</view>
						<view class="status-item">
							<text class="label">车辆进入：</text>
							<text class="entrance">{{content.inputTime}} &nbsp;&nbsp; 西门</text>
						</view>
						<view class="status-item">
							<text class="label">车辆离开：</text>
							<text class="entrance">{{content.outTime}} &nbsp;&nbsp;东门</text>
						</view>
					</view>
				</block>
				<block v-else>
					<view class="status-wrap">
						<view class="tips">
							<view>您好，<text class="phone">{{mobile}}</text>用户，您的排队号是：</view>
							<view class="status-logout" @click="logout"><image src="../../static/images/Logout.png" mode=""></image></view>
						</view>
						<view class="status-show">
							<view class="done-wrap" style="color: #666666;font-weight: 400;padding: 250rpx 0;">
								本日暂无任务
							</view>
						</view>
						
					</view>
				</block>
			</view>
			<view class="plate-number-wrap" v-if="content.isNull==false">
				<text class="plate-number">
					{{content.licensePlate}}
				</text>
			</view>

		</block>
	</view>
</template>

<script>
	// 按需导入 mapMutations 辅助函数
	import { mapState, mapMutations } from 'vuex'
	export default {
		computed: {
			// 将 m_user 模块中的 userinfo 映射到当前页面中使用
			...mapState('m_user', ['userinfo','token']),
		},
		data() {
			return {
				mobile: '',
				countDownAwait: {					
					hour: 0,
					minute: 0,
					second: 0,
				},
				countDownTime: {
					'isShow': true,
					'hour': '00',
					'minute': '00',
					'second': '00'
				}, 
				clearTimer: false,
				carStatus: 1,
				content:{
					targetTime: "2021-10-01 20:20:00",  //状态4
					targetTimeAwait: "2021-10-01 10:00:00", //等候时间
					frontRankNum:0,
					inputSystemTime:0,
					inputTime:0,
					isNull:0,
					licensePlate:0,
					mobile:0,
					outSystemTime:0,
					outTime:0,
					rankNum:0,
					workState:0,
				}
			}
		},
		onLoad(options) {
			this.mobile = this.$store.state.m_user.token;
			this.dataInfo();
		},
		onPullDownRefresh() {
			this.dataInfo();
			
			uni.showLoading({
			    title: '刷新中'
			});
			
			setTimeout(function () {
			    uni.hideLoading();
				uni.stopPullDownRefresh()
			}, 2000);
		},
		methods: {
			...mapMutations('m_user', ['updateUserInfo', 'updateToken']),			
			//分享给好友
			onShareAppMessage(e) {
				return {
				  title: '茂南石化工业园区车辆管理平台'
				}
			},
			//获取首页信息
			async dataInfo(){
				
				let mobile = this.$store.state.m_user.token;
				const indexResult = await uni.$http.get(uni.$url.driverIndex,{mobile});
				
				this.content.isNull = indexResult.data.data.isNull;
				this.content.mobile = indexResult.data.data.mobile;
				if(indexResult.data.data.isNull==false){
					this.carStatus = indexResult.data.workState;
					if(indexResult.data.data.outSystemTime!=null){
						this.content.targetTime = indexResult.data.data.outSystemTime;
						this.countDown();
					}

					this.content.frontRankNum = indexResult.data.data.frontRankNum;
					
					if(indexResult.data.data.inputSystemTime !== null) {
						let inputTime = indexResult.data.data.inputSystemTime.split(" ");
						this.content.inputSystemTime = inputTime[1];
					}
					if(indexResult.data.data.outSystemTime !== null) {
						let outTime = indexResult.data.data.outSystemTime.split(" ");
						this.content.outSystemTime = outTime[1];
					}

					this.content.inputTime = indexResult.data.data.inputTime;
					this.content.licensePlate = indexResult.data.data.licensePlate;
					
					this.content.outTime = indexResult.data.data.outTime;
					this.content.rankNum = indexResult.data.data.rankNum;
					this.content.waitTime = indexResult.data.data.waitTime;
					this.carStatus = indexResult.data.data.workState;
				}
				
				this.awaitTime(this.content.waitTime);  //等候倒计时
			},
			//退出登录
			async logout(){
				
				
				// 询问用户是否退出登录
				const [err, succ] = await uni.showModal({
					title: '提示',
					content: '是否退出登录？'
				}).catch(err => err)
				
				//确认则退出
				if (succ && !succ.confirm) return;
				
				
				// const logoutResult = await uni.$http.get(uni.$url.driverLogout);
				
				// if (logoutResult.data.code !== 200) uni.$showMsg(res.data.msg);
				
				// this.updateUserInfo({});
				this.updateToken('');
				
				uni.navigateTo({
					url: '/pages/index/index'
				})
				
				
			},
			countDown() {
				const self = this;
				setTimeout(() => {
					self.getFinalTime.call(self);
				}, 1000);
			},
			getFinalTime() {
				const targetTime = new Date(this.content.targetTime).getTime();
				const gapTime = Math.ceil((targetTime - new Date().getTime())/1000); // 距离结束时间
				// let time = '00天00:00:00';
				// let day = "00";
				let hour = '00';
				let minute = '00';
				let second = '00';
				
				if(gapTime > 0) {
				
					let lastTime = gapTime % 86400;
					// const dayVal = parseInt(gapTime/86400);
					// day = dayVal > 9 ? dayVal : `0${dayVal}`;
					const hourVal = parseInt(lastTime/3600);
					hour = hourVal > 9 ? hourVal : `0${hourVal}`;
					lastTime = lastTime % 3600;
					const minuteVal = parseInt(lastTime/60);
					minute = minuteVal > 9 ? minuteVal : `0${minuteVal}`;
					const secondVal = lastTime% 60;
					second = secondVal > 9 ? secondVal : `0${secondVal}`;
		
					let countDownTime = {
						// time: "活动剩余:",
						// day: day,
						isShow: true,  //判断是否展示倒计时
						hour: hour,
						minute: minute,
						second: second
					}
		
		
					this.countDownTime = countDownTime;
					// console.log("hour",hour);
					// time = `${day}天${hour}:${minute}:${second}`;
					// if(!this.clearTimer) return this.init.call(this);
					if(!this.clearTimer) this.countDown.call(this);
		
				} else {
					
					let countDownTime = {
						// time: "活动结束:",
						// day: '00',
						isShow: false,  //判断是否展示倒计时
						hour: '00',
						minute: '00',
						second: '00',
					}
		
					this.countDownTime = countDownTime;
					
					return
				}
		
			},
			formatNum(num) {
				return num > 9 ? num : `0${num}`;
			},
			awaitTime(targetTimeAwait) {
				const targetTime = new Date(targetTimeAwait).getTime();
				const gapTime = Math.ceil((targetTime - new Date().getTime())/1000); // 距离结束时间
				// let time = '00天00:00:00';
				// let day = "00";
				let hour = '00';
				let minute = '00';
				let second = '00';
				
				if(gapTime > 0) {
				
					let lastTime = gapTime % 86400;
					// const dayVal = parseInt(gapTime/86400);
					// day = dayVal > 9 ? dayVal : `0${dayVal}`;
					const hourVal = parseInt(lastTime/3600);
					hour = hourVal > 9 ? hourVal : `${hourVal}`;
					lastTime = lastTime % 3600;
					const minuteVal = parseInt(lastTime/60);
					minute = minuteVal > 9 ? minuteVal : `${minuteVal}`;
					const secondVal = lastTime% 60;
					second = secondVal > 9 ? secondVal : `${secondVal}`;
						
					let countDownAwait = {
						// time: "活动剩余:",
						// day: day,
						isShow: true,  //判断是否展示倒计时
						hour: Number(hour),
						minute: Number(minute),
						second: Number(second)
					}
						
						
					this.countDownAwait = countDownAwait;
					// console.log("hour",hour);
					// time = `${day}天${hour}:${minute}:${second}`;
					// if(!this.clearTimer) return this.init.call(this);
					// if(!this.clearTimer) this.countDown.call(this);
						
				} else {
					
					let countDownAwait = {
						// time: "活动结束:",
						// day: '00',
						isShow: false,  //判断是否展示倒计时
						hour: '00',
						minute: '00',
						second: '00',
					}
						
					this.countDownAwait = countDownAwait;
					
					return
				}
						
			},
			timeup() {
				
				this.awaitTime(this.content.waitTime);  //等候倒计时
				this.countDown();
			}
		}
	}
</script>

<style lang="scss">

	page {
		position: relative;
		background-color: #efefef;
		width: 100%;
		height: 100%;
	}
	
	.wrapper {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
	}
	
	.cu-bar.fixed {
		top: auto;
	}
	
	.cuIcon-back:before {
	    content: "";
	}
	
	.status-wrap {
		margin-top: 30rpx;
		padding-top: 30rpx;
		background: #ffffff;
		.tips {
			display: flex;
			justify-content: space-between;
			padding: 0 30rpx;
			font-size: 28rpx;
			font-weight: 400;
			color: #666666;
			.phone {
				font-size: 28rpx;
				font-weight: bold;
				color: #009CFF;
			}
			.status-logout{
				
				image{
					width: 26rpx;
					height: 24rpx;
				}
			}
		}
		.status-show {
			margin-bottom: 100rpx;
			text-align: center;
			.line-up-wrap {
				line-height: 148rpx;
				font-size: 200rpx;
				padding: 100rpx 0 60rpx 0;
			}
			.count-down-wrap {
				padding: 120rpx 0 90rpx 0; 
				font-size: 120rpx;
				font-weight: bold;
				color: #FF0000;
			}
			.done-wrap {
				padding: 130rpx 0 80rpx 0; 
				font-size: 100rpx;
				font-weight: bold;
				color: #333333;
			}
			.text {
				font-size: 34rpx;
				font-weight: 400;
				color: #666666;
				.strong {
					font-weight: bold;
					color: #ff0000;
					margin: 0 10rpx;
				}
			}
		}
		.status-item {
			padding: 50rpx 30rpx;
			border-top: 1px dashed #AAAAAA;
			.label {
				font-size: 34rpx;
				font-weight: 400;
				color: #666666;
			}
			.time {
				display: inline-block;
				font-size: 34rpx;
				font-weight: bold;
				color: #FF0000;
			}
			.entrance {
				font-size: 30rpx;
				font-weight: bold;
				color: #010101;
			}
		}
	}
	
	.plate-number-wrap {
		position: fixed;
		bottom: 0;
		width: 100%;
		height: 120rpx;
		line-height: 120rpx;
		background: #FFC600;
		text-align: center;
		.plate-number {
			color: #010101;
			font-size: 44rpx;
			font-weight: bold;
		}
	}
	
	.uni-countdown__number {
		display: inline-block;
		padding: 0;
		margin: 0;
		color: #FF0000;
	}
</style>
