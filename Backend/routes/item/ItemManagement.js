const express = require('express');
const router = express.Router();
const itemManagementController = require('../../controller/item/itemManagement');
const categoryController = require('../../controller/item/category');
const itemEditController = require('../../controller/item/editItem');
const authUtil = require('../../config/jwt/auth').checkToken;
const authEdit = require('../../config/jwt/auth').authEdit;
const authOpen = require('../../config/jwt/auth').authOpen;


/**
 * 담당자 : 강재민
 * 함수 설명 : 물품관리 페이지 렌더링
 * 미들 웨어 : 토큰 검증
 */
router.get('/', authUtil, itemManagementController.index);

/**
 * 담당자 : 강재민
 * 함수 설명 : 전체 물품 검색 API
 * 미들 웨어 : 토큰 검증
 */
router.get('/findAll', authUtil, itemManagementController.findAll);

/**
 * 담당자 : 강재민
 * 함수 설명 : 물품명으로 물품 검색 API(대분류, 소분류, 검색키워드)
 * 미들 웨어 : 토큰 검증
 */
router.get('/find/item/:parentCategory/:childCategory/:keyword', authUtil, itemManagementController.findByItem);

/**
 * 담당자 : 강재민
 * 함수 설명 : 대여자명으로 물품 검색 API(대분류, 소분류, 키워드)
 * 미들 웨어 : 토큰 검증, 열람 권한
 */
router.get('/find/lender/:parentCategory/:childCategory/:keyword', authUtil, authOpen ,itemManagementController.findByLender);

/**
 * 담당자 : 강재민
 * 함수 설명 : 대분류로 소분류 리스트 검색 API(대분류)
 * 미들 웨어 : 토큰 검증
 */
router.get('/find/childcategory/:keyword', authUtil, categoryController.findChildCategoryByParent);

/**
 * 담당자 : 강재민
 * 함수 설명 : 대분류로 물품 검색 API(대분류)
 * 미들 웨어 : 토큰 검증
 */
router.get('/find/item/parentCategory/:keyword', authUtil, itemManagementController.findByParentCategory);

/**
 * 담당자 : 강재민
 * 함수 설명 : 소분류로 물품 검색 API(소분류)
 * 미들 웨어 : 토큰 검증
 */
router.get('/find/item/childCategory/:keyword', authUtil, itemManagementController.findByChildCategory);


/**
 * 담당자 : 정희성
 * 함수 내용 : 해당 물품 정보 불러오는 GET API
 * 미들 웨어 : 토큰 검증, 편집 권한 검증
 **/
router.get('/edit/:id', authUtil, authEdit, itemEditController.index);
/**
 * 담당자 : 정희성
 * 함수 내용 : 수정한 물품 정보를 저장하는 POST API
 * 미들 웨어 : 토큰 검증, 편집 권한 검증
 **/
router.post('/update/:id', authUtil, authEdit, itemEditController.updateItem);

router.delete('/delete/:id', authUtil, authEdit, itemManagementController.deleteById);

router.get('/history/:itemId', authUtil, authOpen, itemManagementController.rentHistory);

module.exports = router;
