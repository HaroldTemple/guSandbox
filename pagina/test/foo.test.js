describe('Suma dos operandos...', function () {
  describe('sum()', function () {
    it('Debe retornar una suma', function () {
      chai.expect( sum (1, 2) ).to.equal (3) ;
      chai.expect( sum (-2, 2) ).to.equal (0);
      chai.expect( sum (-10, -(-20)) ).to.equal (10);
    });
  });
});