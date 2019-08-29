<table class="table1" style="width:90%;margin-top:15px;" border="0" cellpadding="0" cellspacing='0'>
  <caption>
    <strong style="font-size:28px">财政专户拨款表</strong>
  </caption>  
 </table>
<div style="margin-left: 90px;width:86%;height:30px;text-align:right;padding-right:45px;">单位：元</div>
 <table class="mainTable" style="width:86%;margin-left:90px" border="1" cellpadding="0" cellspacing='0'>
  <tbody>
  <tr>
    <td colspan="3" class="fieldTitle ">
		科目编码
	</td>
	<td rowspan="2" class="fieldTitle" style="width: 80px;">科目名称</td>
	<td rowspan="2" class="fieldTitle" style="width: 20px;">部门编码</td>
	<td rowspan="2" class="fieldTitle" style="width: 160px;">部门名称</td>
	<td rowspan="2" class="fieldTitle" style="width: 85px;">金额</td>
	<td rowspan="2" class="fieldTitle" style="width: 120px;">文号</td>
  </tr>
	<tr>
    <td class="fieldTitle tabletdheight">类</td><td class="fieldTitle tabletdheight">款</td><td class="fieldTitle tabletdheight">项</td>
  </tr>
  
  <#-- 资金构成list -->
  <#list zjList as item> 
    <tr>
      <td class="fieldContent tabletdheight">${item.类}</td>
      <td class="fieldContent tabletdheight">${item.款}</td>
      <td class="fieldContent tabletdheight">${item.项}</td>
      <td class="fieldContent">${item.科目名称}</td>
      <td class="fieldContent">${item.部门编码}</td>
      <td class="fieldContent">${item.部门名称}</td>
      <td class="fieldContentRight">${item.金额}</td>
      <td class="fieldContent">${item.指标文号}</td>
    </tr>
  </#list>

  </tbody>
</table>
