<template>
	<view class="wrapper">
		<cu-custom bgColor="bg-white" :isBack="true">
			<block slot="backText">茂南石化工业园区车辆管理平台</block>
		</cu-custom>
		
		<view class="content" :style="{'padding-top':contentTop+'px'}">
			<image class="bg-login" src="../../static/images/bg-login.png" mode="aspectFill" :style="{'top':contentTop}"></image>
			<view class="login-wrap">
				<image class="logo" src="../../static/images/logo.png"></image>
				<view class="input-item">
					<input type="number" class="input input-phone" placeholder="请输入手机号码" v-model.trim="mobile" @confirm="login">
				</view>
				<view class="input-item input-item-auth" style="display: none;">
					<input type="number" class="input input-auth-code" v-model.trim="authCode" placeholder="请输入验证码"/>
					<block v-if="countDownNum==60 || countDownNum==-1">
						<view class="btn-auth-code" @click="countDown">获取验证码</view>
					</block>
					<block v-else>
						<view class="btn-auth-code">{{countDownNum}}s后重新发送</view>
					</block>
				</view>
				<button class="btn-login" type="default" @click="login">登&nbsp;&nbsp;录</button>
			</view>
		</view>
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
				contentTop: this.CustomBar + 'px',
				mobile: '',
				authCode: '',
				countDownNum: 60,
			}
		},
		onShow() {
			let token = this.$store.state.m_user.token;
			if(!token) {
			     // this.updateUserInfo({});
			     this.updateToken('');
			} else {
				uni.navigateTo({
					url: "/pages/status/status?carStatus=1"
				})
			}
			
		},
		methods: {
			...mapMutations('m_user', ['updateUserInfo', 'updateToken']),
			//分享给好友
			onShareAppMessage(e) {
				return {
				  title: '茂南石化工业园区车辆管理平台'
				}
			},
			inputMobileChange(e){
				this.mobile = e.detail.value
			},
			async countDown() {
				
				console.log(this.mobile);
				
				let regex = new RegExp(/^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/);
				
				if(!this.mobile || this.mobile == '') return uni.showToast({title:'手机号码不能为空!', icon: 'none', duration: 2000});
								
								
				if (!regex.test(this.mobile)) return uni.showToast({ title: '请填写正确的手机号码', icon: 'none', duration: 2000 });
				
				let query = {
					mobile: this.mobile
				}
				
				const res = await uni.$http.get(uni.$url.sendLoginSmsCode, query);
				
				if (res.data.code !== 200) return uni.$showMsg(res.data.msg);
			
				
				var _this = this;
				var countDownNum = _this.countDownNum;             // 获取倒计时初始值
				var timer = setInterval(function() {
				  countDownNum -= 1;
				  _this.countDownNum = countDownNum;
				  if(countDownNum <= -1) {
					clearInterval(timer);
					// 取消置顶的setInterval函数将要执行的代码
					_this.countDownNum = 60;
				  }
				}, 1000);
			},
			async login() {
				
				
				let regex = new RegExp(/^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/);
				
				if(!this.mobile || this.mobile == '') return uni.showToast({title:'手机号码不能为空!', icon: 'none', duration: 2000});
								
								
				if (!regex.test(this.mobile)) return uni.showToast({ title: '请填写正确的手机号码', icon: 'none', duration: 2000 });
				
				// if(!this.authCode || this.authCode == '') return uni.showToast({title:'验证码不能为空!', icon: 'none', duration: 2000});
				
				
				// 准备参数对象
				const query = {
					mobile: this.mobile,
					// smsCode: this.authCode
				};
				
				const loginResult = await uni.$http.post(uni.$url.wxLoginUrl, query);
				
				if (loginResult.data.code !== 200) return uni.$showMsg(loginResult.data.msg);
				
				// console.log(loginResult);
				uni.showToast({ title: loginResult.data.msg, icon: 'success', duration: 2000 });
				
				this.updateToken(loginResult.data.data);
				
				uni.navigateTo({
					url: "/pages/status/status"
				})
				
			}
		}
	}
</script>

<style lang="scss">
	
	page {
		background-color: #efefef;
	}
	
	.cuIcon-back:before {
	    content: "";
	}
	
	.content {
		display: flex;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		justify-content: center;
		align-items: center;
	}
	
	.bg-login {
		position: absolute;
		top: 0;
		right: 0;
	}
	
	.login-wrap {
		position: absolute;
		// top: 10%;
		left: 0;
		// bottom: 10%;
		right: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		.logo {
			display: inline-block;
			width: 354rpx;
			height: 94rpx;
			margin-bottom: 80rpx;
		}
		.input-item {
			margin-bottom: 30rpx;
			input {
				padding: 0 20rpx;
			}
			.input-phone {
				width: 400rpx;
				height: 66rpx;
				background: #FFFFFF;
				border-radius: 6rpx;
				font-size: 30rpx;
			}
			.input-auth-code {
				display: inline-block;
				width: 220rpx;
				height: 66rpx;
				background: #FFFFFF;
				border-radius: 6rpx;
			}
		}
		.input-item-auth {
			display: flex;
			.btn-auth-code {
				display: flex;
				width: 160rpx;
				height: 66rpx;
				margin-left: 20rpx;
				background: #9CB6C2;
				border-radius: 6rpx;
				font-size: 24rpx;
				font-weight: 400;
				color: #FFFFFF;
				justify-content: center;
				align-items: center;
			}
		}
		.btn-login {
			display: inline-block;
			margin-top: 20rpx;
			width: 400rpx;
			height: 66rpx;
			line-height: 66rpx;
			background: #46C4FF;
			border-radius: 6rpx;
			font-size: 34rpx;
			font-weight: bold;
			color: #FFFFFF;
		}
	}
	

</style>
