/**
* 담당자 : 정희성
* 파일 설명 : 대여 중인 모든 물품목록과 대여 중 및 반남된 모든 물품목록을 가져오는 자바 스크립트 파일
**/
const { Rent } = require('../../models/rent')
const jwt = require("../../config/jwt/jwt");

const rentalStatus = {
    /**
    * 담당자 : 정희성
    * 함수 내용 : 대여 중인 모든 물품 및 대여 및 반납완료된 모든 물품을 가져오는 함수
    * 주요 기능 : populate를 통해 해당 itemInfo 정보를 가져오는 기능
     *           sort를 통해 대여 날짜, 반납 날짜를 정렬해주는 기능
    **/
    index: (req, res) => {
        // 대여 중이거나 반납이 완료된 모든 물품을 찾는 기능
        Rent.find({})
            .populate("itemInfo")
            .sort({rentDate : -1, returnDate: -1})
            .exec((err, rentRecord) => {
                // 대여 중인 물품을 filter를 통해 찾는 기능
                Rent.find({rentStatus : true})
                    .populate("itemInfo")
                    .sort({rentDate: -1})
                    .exec((err, rentalStatus) => {
                        res.render('./rent/rentalStatus',{
                            rentingInfo: rentalStatus,
                            name: req.name,
                            workNumber: req.workNumber,
                            authority: req.authority,
                            rentRecord: rentRecord
                        });
                    });
            });
    },
}

module.exports = rentalStatus;