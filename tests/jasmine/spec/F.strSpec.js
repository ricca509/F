describe('The string module F.str', function() {
    it('can trim string at the beginning', function() {
        var str = '  hello';
        expect(str.length).toBe(7);
        expect(F.str.trimStart(str).length).toBe(5);
    });

    it('can trim string at the end', function() {
        var str = 'hello  ';
        expect(str.length).toBe(7);
        expect(F.str.trimEnd(str).length).toBe(5);
    });

    it('can trim strings at both sides', function() {
        var str = '  hello  ';
        expect(str.length).toBe(9);
        expect(F.str.trim(str).length).toBe(5);
    });
});
