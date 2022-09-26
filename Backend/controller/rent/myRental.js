const { Rent } = require('../../models/rent')
const { Item } = require('../../models/Item')
const { User } = require('../../models/User')
const jwt = require("../../config/jwt/jwt");
/**
 * 담당자 : 강재민, 정희성
 * 파일 설명 : 나의 대여 현황의 Service기능을 담당하는 JavaScript 파일 입니다.
 */
const myRental = {
    /**
     * 담당자 : 강재민
     * 함수 설명 : 나의 대여 현황 렌더링
     * 기능 설명 : - user_id로 현재 대여중인 대여 현황 검색(populate를 사용하여 물품 정보도 함께 검색)
     *              - user_id로 반납 완료 된 대여 현황 검색(populate를 사용하여 물품 정보도 함께 검색)
     *              - 유저 정보 검색
     */
    index: async (req, res) => {
        /* aggregate를 사용해 데이터를 바인딩하는 방법 */
        // const filter = [
        //     {'$match':{'workNumber' : req.workNumber}},
        //     {'$lookup': {'from': 'items', 'localField': 'itemCode', 'foreignField': 'code', 'as': 'itemInfo'}},
        //     {'$unwind': {'path': '$itemInfo'}},
        //     {'$addFields': {'itemName': '$itemInfo.name', 'category': '$itemInfo.category', 'itemNumber': '$itemInfo.number'}},
        //     {'$project': {'userName': 1, 'workNumber': 1, 'itemNumber': 1, 'itemCode': 1, 'itemName': 1, 'category': 1, 'purpose': 1, 'rentDate': 1, 'returnPlanDate': 1}}];
        //
        // Rent.aggregate((filter), async(err, result) => {
        //     res.render('myRental', {
        //         name: req.name,
        //         workNumber: req.workNumber,
        //         rentInfo: result
        //     });
        // });

        // 대여중인 나의 대여 이력 검색(사번과 대여상태가 대여중)
        /* populate 사용 */
        const rentInfo = await Rent.find({$and : [{workNumber : req.workNumber}, {rentStatus : true} ]})
            .populate("itemInfo")
            .sort({rentDate : 1})
            .exec();

        // 반납처리된 나의 대여 이력 검색(사번과 대여상태가 반납)
        const returnInfo = await Rent.find({$and : [{workNumber : req.workNumber}, {rentStatus : false} ]})
            .populate("itemInfo")
            .sort({rentDate : -1, returnDate: -1})
            .exec();

        // 유저 정보 검색
        const userInfo = await User.findOne({workNumber: req.workNumber})
            .exec();

        res.render('./rent/myRental', {userInfo, rentInfo, returnInfo, name: req.name, workNumber: req.workNumber, authority : req.authority});

    },
    /**
     * 담당자 : 강재민
     * 함수 설명 : 물품 반납 함수
     * 기능 설명 : - 대여이력의 대여상태를 반납으로 변경, 반납일을 현재날짜로 저장
     *              - 물품정보의 대여중 수량 1 감소
     *              - 잔여 수량이 부족하여 대여가능여부가 false 였던 아이템 true로 변경
     */
    returnItem: (req, res) => {
        // 대여 이력의 대여 상태를 반납으로 변경, 반납일을 현재 날짜로 저장
        Rent.findOneAndUpdate({_id: req.params.rentId},
            {$set : {returnDate : new Date(), rentStatus : false}},
            function(err, result){
                if(err) console.log(err);
                else return res.json({returnSuccess : true, result});
            });

        // 물품정보의 대여 중 수량 1 감소
        Item.findOneAndUpdate({_id: req.params.itemId},
            {$pull : {rentInfo : req.params.rentId}, $inc : {"count.renting" : -1}},
            function(err, result){
                if(err) console.log(err);
                // 대여수량이 총 수량과 같고, 대여가능여부가 false인 경우 대여가능여부를 true로 변경
                if(result.available.rental === false && result.count.renting === result.count.all){
                    Item.findOneAndUpdate({_id: req.params.itemId},
                        {$set: {"available.rental" : true}},
                        function(err, result){
                        if(err) console.log(err);
                        console.log("대여가능여부 true");
                    });
                }
        });

    },
    /**
    * 담당자 : 정희성
    * 함수 내용 : 접속한 유저 정보를 수정해주는 함수
    * 주요 기능 : 접속한 유저의 사번을 통해 filter 한 후 입력한 값으로 수정해주는 기능
     *           수정 완료 시 메시지로 알려주는 기능
    **/
    updateUser: (req, res) => {
        //url로 받은 keword(workNumber)로 filter 후 업데이트
        User.updateOne({workNumber: req.params.keyword},
            {
                $set: {name: req.body.name,
                    department: req.body.department,
                    role: req.body.role,
                    email: req.body.email,
                    }
            },
            (err, user) => {
            if (err) console.log(err);
            else res.json({user: user, message: "회원 수정이 완료되었습니다!"})
            });
    },
    /**
    * 담당자 : 정희성
    * 함수 내용 : 접속한 유저의 비밀번호를 수정해주는 함수
    * 주요 기능 : 접속한 유저의 사번을 통해 filter 후 입력한 비밀번호로 수정해주는 기능
     *           비밀번호 수정 완료 시 메시지로 알려주는 기능
    **/
    updatePassword: (req, res) => {
        //url로 받은 keword(workNumber)로 filter 후 업데이트
        User.updateOne({workNumber: req.params.keyword},
            {
                $set: {password: req.body.password}
            },
            (err, user) => {
                if (err) console.log(err);
                else res.json({user: user, message: "비밀번호 수정이 완료되었습니다!"})
            });
    }
}


module.exports = myRental;