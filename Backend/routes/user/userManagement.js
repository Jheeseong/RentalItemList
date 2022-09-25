const express = require('express');
const router = express.Router();
const userManagement = require('../../controller/user/usermanagement')
const authUtil = require('../../config/jwt/auth').checkToken;
const authAdmin = require('../../config/jwt/auth').authAdmin;
module.exports = router;
/**
 * 담당자 : 정희성
 * 함수 내용 : 이용자 관리 페이지 렌더링
 * 미들 웨어 : 토큰 검증, 관리자권한 검증
 **/
router.get('/', authUtil, authAdmin, userManagement.index);
/**
 * 담당자 : 정희성
 * 함수 내용 : 해당 유저 삭제해주는 delete API
 * 미들 웨어 : 토큰 검증, 관리자권한 검증
 **/
router.delete('/delete/:id', authUtil, authAdmin, userManagement.deleteById);
/**
 * 담당자 : 정희성
 * 함수 내용 : 해당 유저의 편집권한 수정해주는 POST API
 * 미들 웨어 : 토큰 검증, 관리자권한 검증
 **/
router.post('/update/edit/:id', authUtil, authAdmin, userManagement.AuthorityEdit);
/**
 * 담당자 : 정희성
 * 함수 내용 : 해당 유저의 대여권한 수정해주는 POST API
 * 미들 웨어 : 토큰 검증, 관리자권한 검증
 **/
router.post('/update/rental/:id', authUtil, authAdmin, userManagement.AuthorityRental);
/**
 * 담당자 : 정희성
 * 함수 내용 : 해당 유저의 열람권한 수정해주는 POST API
 * 미들 웨어 : 토큰 검증, 관리자권한 검증
 **/
router.post('/update/open/:id', authUtil, authAdmin, userManagement.AuthorityOpen);
/**
 * 담당자 : 정희성
 * 함수 내용 : 해당 유저의 관리자권한 수정해주는 POST API
 * 미들 웨어 : 토큰 검증, 관리자권한 검증
 **/
router.post('/update/admin/:id', authUtil, authAdmin, userManagement.AuthorityAdmin);
/**
 * 담당자 : 정희성
 * 함수 내용 : 해당 유저의 비밀번호를 초기화해주는 POST API
 * 미들 웨어 : 토큰 검증, 관리자권한 검증
 **/
router.post('/update/password/:id', authUtil, authAdmin, userManagement.resetPassword);