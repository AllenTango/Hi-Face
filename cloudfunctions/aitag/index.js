const extCi = require("@cloudbase/extension-ci")
const tcb = require("tcb-admin-node")

tcb.init({
  env: 'dev-pupws'
})
tcb.registerExtension(extCi)

exports.main = async({
  fileID
}) => {

  try {
    let tmp = fileID.split("/")
    let cloudPath = tmp[tmp.length - 1]
    const res = await tcb.invokeExtension('CloudInfinite', {
      action: 'DetectLabel',
      cloudPath: cloudPath
    })
    const {
      Labels
    } = res.data.RecognitionResult
    console.log(Labels)
    return Labels;
  } catch (err) {
    console.log('error :', err);
    return err;
  }
}