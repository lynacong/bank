package gov.df.f_ebank.lyn.controller;

import com.yonyougov.f_ebank.lyn.api.ICommonUpdateBusiness;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by liyanan on 2019/8/28.
 */
@SuppressWarnings({"unchecked","rawtypes"})
@Controller
@RequestMapping(value = "/df/f_ebank/payAgentBill")
public class PayAgentBillQueryController {

    @Autowired
    public ICommonUpdateBusiness commonUpdateBusinessImpl;

    @RequestMapping(value = "/updateField.do", method = RequestMethod.POST)
    public @ResponseBody
    Map<String ,String> updateField(HttpServletRequest request,
                    HttpServletResponse response){

        Map m=new HashMap<String,String>();
        m.put("flag","0");
        commonUpdateBusinessImpl.updateFieldByNo(m);
        System.out.println("11111");
        return m;
    }

    @ResponseBody
    @RequestMapping(value = "/test.do",method = RequestMethod.GET)
    public  String test(HttpServletRequest request,
                HttpServletResponse response){
        System.out.println(
                "shuchu"
        );
        return "success";
    }
}
