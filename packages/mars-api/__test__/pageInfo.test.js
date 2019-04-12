/**
 * @file pageInfo api unit test
 * @author zhangjingyuan02
 */

import * as PageInfo from '../api/pageInfo/index';

/* global jest, test */
describe('[api]pageInfo', () => {
    test('api:setPageInfo', () => {
        const success = jest.fn();
        const fail = jest.fn();
        const complete = jest.fn();
        PageInfo.setPageInfo({
            title: 'test title',
            keywords: 'test,test,test',
            description: 'test content',
            success,
            fail,
            complete
        });
        expect(document.title).toBe('test title');
        expect(document.querySelector('meta[name="keywords"]').content).toBe('test,test,test');
        expect(document.querySelector('meta[name="description"]').content).toBe('test content');
        expect(success).toHaveBeenCalled();
        expect(complete).toHaveBeenCalled();
        PageInfo.setPageInfo({
            title: 'test title',
            success,
            fail
        });
        expect(fail).toHaveBeenCalled();
    });

    test('api:setMetaDescription', () => {
        const success = jest.fn();
        const fail = jest.fn();
        const complete = jest.fn();
        PageInfo.setMetaDescription({
            content: 'test2',
            success,
            complete,
            fail
        });
        expect(document.querySelector('meta[name="description"]').content).toBe('test2');
        expect(success).toHaveBeenCalled();
        expect(complete).toHaveBeenCalled();
        expect(fail).not.toHaveBeenCalled();
        PageInfo.setMetaDescription({
            success,
            complete,
            fail
        });
        expect(fail).toHaveBeenCalled();
    });

    test('api:setMetaKeywords', () => {
        const success = jest.fn();
        const fail = jest.fn();
        const complete = jest.fn();
        PageInfo.setMetaKeywords({
            content: 'test2,keyword',
            success,
            complete,
            fail
        });
        expect(document.querySelector('meta[name="keywords"]').content).toBe('test2,keyword');
        expect(success).toHaveBeenCalled();
        expect(complete).toHaveBeenCalled();
        expect(fail).not.toHaveBeenCalled();
        PageInfo.setMetaKeywords({
            success,
            complete,
            fail
        });
        expect(fail).toHaveBeenCalled();
    });

    test('api:setDocumentTitle', () => {
        const success = jest.fn();
        const fail = jest.fn();
        const complete = jest.fn();
        PageInfo.setDocumentTitle({
            title: 'test2-title',
            success,
            complete,
            fail
        });
        expect(document.title).toBe('test2-title');
        expect(success).toHaveBeenCalled();
        expect(complete).toHaveBeenCalled();
        expect(fail).not.toHaveBeenCalled();
        PageInfo.setDocumentTitle({
            success,
            complete,
            fail
        });
        expect(fail).toHaveBeenCalled();
    });
});
