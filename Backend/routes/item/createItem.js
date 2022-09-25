const express = require('express');
const router = express.Router();
const createItemController = require('../../controller/item/createItem');
const createCategoryController = require('../../controller/item/category');
const authEdit = require('../../config/jwt/auth').authEdit;
const authUtil = require('../../config/jwt/auth').checkToken;
/**
* 담당자 : 정희성
* 함수 내용 : 물품 저장 POST API
* 미들 웨어 : 토큰 검증, 편집 권한 검증
**/
//POST 물품 등록
router.post('/api/createItem',authUtil, authEdit, createItemController.saveItem);
/**
* 담당자 : 정희성
* 함수 내용 : 카테고리 저장 POST API
* 미들 웨어 : 토큰 검증, 편집 권한 검증
**/
router.post('/api/createCategory/:keyword',authUtil, authEdit, createCategoryController.saveCategory);
/**
 * 담당자 : 정희성
 * 함수 내용 : 대분류 카테고리 불러오는 GET API
 * 미들 웨어 : 토큰 검증, 편집 권한 검증
 **/
router.get('/api/find/prentCategory',authUtil, authEdit, createCategoryController.findParentCategory);
/**
 * 담당자 : 정희성
 * 함수 내용 : 대분류 카테고리에 담긴 소분류 카테고리 불러오는 GET API
 * 미들 웨어 : 토큰 검증, 편집 권한 검증
 **/
router.get('/api/find/childcategory/:keyword',authUtil, authEdit, createCategoryController.findChildCategoryByParent);

module.exports = router;
