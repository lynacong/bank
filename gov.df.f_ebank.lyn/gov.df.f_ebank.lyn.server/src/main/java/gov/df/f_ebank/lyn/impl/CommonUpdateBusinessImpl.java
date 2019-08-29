package gov.df.f_ebank.lyn.impl;

import com.yonyougov.f_ebank.lyn.api.ICommonUpdateBusiness;
import gov.df.fap.service.util.dao.GeneralDAO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.util.Map;

/**
 * Created by liyanan on 2019/8/29.
 */
@Service
public class CommonUpdateBusinessImpl  implements ICommonUpdateBusiness {

    @Autowired
    @Qualifier("generalDAO")
    private GeneralDAO generalDAO;
    @Override
    public int updateFieldByNo(Map map) {
        System.out.println("这个是server");
        return 0;
    }
}
