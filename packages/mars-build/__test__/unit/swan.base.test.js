/**
 * @file swan build unit test
 * @author zhuchongyue <zhuchongyue_web@163.com>
 */
/* eslint-disable */
import {transform} from '../../src/swan/transform';
// import directive from '../../src/swan/transform/directive';

describe('[swan]transform', () => {
    test('transform function exists', () => {
        expect(transform).not.toBe(undefined);
    });
});