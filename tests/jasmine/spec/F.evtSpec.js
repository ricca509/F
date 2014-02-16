describe('The event module F.evt', function() {
    it('let one subscribe to events', function() {
        var key = F.evt.on('test', function(args) {
            console.log('Test ' + args);
        });

        var key2 = F.evt.on('', function(args) {
            console.log('Test ' + args);
        });

        expect(key >= 0).toBe(true);
        expect(key2).toBe(false);
    });

    it('can publish events', function() {
        var callbacks = {
            one: function(args) {
            }
        };
        spyOn(callbacks, 'one');

        var key = F.evt.on('test', callbacks.one);
        F.evt.trigger('test', ['one', 'two']);

        expect(callbacks.one).toHaveBeenCalled();
        expect(callbacks.one.calls.length).toEqual(1);
        expect(callbacks.one).toHaveBeenCalledWith(['one', 'two']);
    });

    it('let one to unsubscribe from an event', function() {
        var callbacks = {
            one: function(args) {
            }
        };
        spyOn(callbacks, 'one');

        var key = F.evt.on('test', callbacks.one);
        F.evt.trigger('test', ['one', 'two']);

        expect(callbacks.one).toHaveBeenCalled();
        expect(callbacks.one.calls.length).toEqual(1);
        expect(callbacks.one).toHaveBeenCalledWith(['one', 'two']);
        expect(F.evt.off('', key)).toBe(false);

        F.evt.trigger('test', ['one', 'two']);

        expect(callbacks.one.calls.length).toEqual(2);

        expect(F.evt.off('test', 7)).toBe(false);

        F.evt.trigger('test', ['one', 'two']);

        expect(callbacks.one.calls.length).toEqual(3);

        expect(F.evt.off('test', key)).toBe(true);

        F.evt.trigger('test', ['one', 'two']);

        expect(callbacks.one.calls.length).toEqual(3);
    });
});
