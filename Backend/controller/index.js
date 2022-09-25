const { User } = require('../models/User');
const { Item } = require('../models/Item');
const jwt = require("../config/jwt/jwt");
const {Rent} = require("../models/rent");
/**
 * 담당자 : 강재민
 * 파일 설명 : 메인페이지의 Service기능을 담당하는 JavaScript 파일 입니다.
 */
const index = {
    /**
     * 담당자 : 강재민
     * 함수 설명 : 메인페이지 렌더링
     * 기능 설명 : - 등록일 최신순으로 물품정보 6개만 추출하여 신규아이템 데이터 전송
     *              - 현재 대여자가 많은 순으로 5개만 추출하여 인기아이템 데이터 전송
     *              - 현재 내가 대여한 정보를 추출하여 나의 대여 정보 데이터 전송
     */
    index: async (req, res) => {
        // 신규 아이템
        const newItems = await Item.find({}).sort({createDate : -1}).limit(6).exec();

        // 인기 아이템 aggregate 필터
        const hotItemFilter = [
            {'$match': {'delete': false }},
            {'$project': {'name': 1, 'code' : 1, 'category': 1, 'rentInfo': {'$size': '$rentInfo'}}},
            {'$sort': {'rentInfo': -1}},
            {'$limit': 5}];

        // 인기 아이템
        const hotItems = await Item.aggregate(hotItemFilter, error => {
            if(error) console.log(error);
        });

        // 나의 대여 정보
        const rentInfo = await Rent.find({$and : [{workNumber : req.workNumber}, {rentStatus : true} ]})
            .populate("itemInfo")
            .exec();

        // 받아온 데이터를 조합하여 index 렌더링
        res.render('index', {
            title: 'Heaventree Item Rental System',
            name: req.name,
            workNumber: req.workNumber,
            authority : req.authority,
            newItems, hotItems, rentInfo
        });
    },
    /**
     * 담당자 : 강재민
     * 함수 설명 : 오류페이지 렌더링
     * 기능 설명 : - 권한없는 페이지 접근 시 오류 페이지 렌더링
     */
    error: (req, res) => {
        res.render('errorUnauthorized', {
            code : "UNAUTHORIZED",
            message : "접근 권한이 없습니다."
        })
    }
}


module.exports = index;