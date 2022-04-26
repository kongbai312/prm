<template>
  <div>
    <!-- on-preview预览的回调 -->
    <!-- http-request 覆盖默认的上传行为，可以自定义上传的实现 -->
    <el-upload
      action="#"
      list-type="picture-card"
      :limit="1"
      :on-preview="preview"
      :on-remove="handleRemove"
      :on-change="changeFile"
      :before-upload="beforeUpload"
      :http-request="upload"
      :file-list="fileList"
      :class="{disabled: fileComputed}"
      >
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-progress v-if="showPercent" style="width: 180px" :percentage="percent" />
    <el-dialog
      title="图片预览"
      :visible.sync="showDialog"
      >
      <img :src="imgUrl" style="width:100%;">
    </el-dialog>
  </div>
</template>

<script>
import COS from 'cos-js-sdk-v5';
//腾讯云 对象存储cos
const cos = new COS({
  SecretId:'',
  SecretKey:'',
})
export default {
  name: '',
  data() {
    return {
      showDialog:false,       //控制弹窗
      imgUrl:'',              //存储图片地址
      currentFileUid:null,    //存储当前文件的uid
      showPercent:false,      //控制进度条是否显示
      percentage:0,           //进度条的百分比
      fileList:[]
    }
  },
  computed:{
    fileComputed() {
      return this.fileList.length === 1
    }
  },
  methods:{
    //预览的函数
    preview(file){
      this.imgUrl = file.url
      this.showDialog = true
    },
    //删除图片
    handleRemove(file,fileList){
      //  fileList 删除后的数组
      // this.fileList = fileList

      //   将原来的文件给排除掉了 剩下的就是最新的数组了
      this.fileList = this.fileList.filter(item => item.uid !== file.uid)
    },
    //添加文件、上传成功和上传失败时都会被调用
    changeFile(file, fileList) {
      this.fileList = fileList.map(item => item)
    },

    //上传图片前的检查
    beforeUpload(file) {
      // 要开始做文件上传的检查了
      // 文件类型 文件大小
      const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      if (!types.includes(file.type)) {
        this.$message.error('上传图片只能是 JPG、GIF、BMP、PNG 格式!')
        return false
      }
      //  检查大小 1MB = 1024KB 1KB=1024B
      const maxSize = 5 * 1024 * 1024
      if (maxSize < file.size) {
        this.$message.error('图片大小最大不能超过5M')
        return false
      }
      this.currentFileUid = file.uid
      //开启进度条
      this.showPercent = true
      return true
    },

    //上传图片
    upload(params){
      // params.file表示上传的文件对象
      // console.log(params)
      //文档地址 https://cloud.tencent.com/document/product/436/64960
      cos.putObject(
        {
          Bucket: 'wenrou-1304205476', /* 填入您自己的存储桶，必须字段 */
          Region: 'ap-guangzhou',  /* 存储桶所在地域，例如ap-beijing，必须字段 */
          Key: params.file.name,  /* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */
          StorageClass: 'STANDARD',       // 上传的模式类型 直接默认 标准模式即可
          Body: params.file, // 上传文件对象
          // 进度条
          onProgress: (params) => {
            this.percent = params.percent * 100
          }
        },
        (err, data)=> {
          //处理成功后返回的数据
          if(!err && data.statusCode===200){
            this.fileList = this.fileList.map(item=>{
              if(item.uid === this.currentFileUid){
                // upload 为true 表示这张图片已经上传完毕 这个属性要为我们后期应用的时候做标记
                // 保存  => 图片有大有小 => 上传速度有快又慢 =>要根据有没有upload这个标记来决定是否去
                return {url:'http://'+data.Location,upload:true}
              }
              return item
            })
            setTimeout(() => {
              this.showPercent = false // 隐藏进度条
              this.percent = 0 // 进度归0
            }, 2000)
          }
        }
      );
    }
  }
}
</script>

<style>
  .disabled .el-upload--picture-card {
    display: none;
  }
</style>
