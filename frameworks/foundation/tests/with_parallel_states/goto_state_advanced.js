// ==========================================================================
// Ki.State Unit Test
// ==========================================================================
/*globals Ki */

var statechart = null;

// ..........................................................
// CONTENT CHANGING
// 

module("Ki.Statechart: With Parallel States - Goto State Advanced Tests", {
  setup: function() {
    
    statechart = Ki.Statechart.create({
      
      monitorIsActive: YES,
      
      rootState: Ki.State.design({
        
        initialSubstate: 'a',

        a: Ki.State.design({
          substatesAreParallel: YES,
          
          b: Ki.State.design({
            initialSubstate: 'd',
            d: Ki.State.design(),
            e: Ki.State.design()
          }),
          
          c: Ki.State.design({
            
            initialSubstate: 'f',
            
            f: Ki.State.design({
              substatesAreParallel: YES,

              h: Ki.State.design({
                initialSubstate: 'l',
                l: Ki.State.design(),
                m: Ki.State.design()
              }),
              
              i: Ki.State.design({
                initialSubstate: 'n',
                n: Ki.State.design(),
                o: Ki.State.design()
              })
            }),
            
            g: Ki.State.design({
              substatesAreParallel: YES,

              j: Ki.State.design({
                initialSubstate: 'p',
                p: Ki.State.design(),
                q: Ki.State.design()
              }),
              
              k: Ki.State.design({
                initialSubstate: 'r',
                r: Ki.State.design(),
                s: Ki.State.design()
              })
            })
          
          })
        }),

        z: Ki.State.design()
      })
      
    });
    
    statechart.initStatechart();
  },
  
  teardown: function() {
    statechart.destroy();
  }
});

test("check statechart initialization", function() {
  var monitor = statechart.get('monitor'),
      root = statechart.get('rootState'), 
      stateA = statechart.getState('a'),
      stateC = statechart.getState('c'),
      stateF = statechart.getState('f'),
      stateG = statechart.getState('g');
  
  equals(monitor.get('length'), 10, 'initial state sequence should be of length 10');
  equals(monitor.matchSequence().begin().entered(root, 'a', 'b', 'd', 'c', 'f', 'h', 'l', 'i', 'n').end(), true, 
         'initial sequence should be entered[ROOT, a, b, d, c, f, h, l, i, n]');
  
  equals(statechart.get('currentStateCount'), 3, 'current state count should be 3');
  equals(statechart.stateIsCurrentState('d'), true, 'current state should be d');
  equals(statechart.stateIsCurrentState('l'), true, 'current state should be l');
  equals(statechart.stateIsCurrentState('n'), true, 'current state should be n');
  
  equals(statechart.stateIsCurrentState('h'), false, 'current state should not be h');
  equals(statechart.stateIsCurrentState('i'), false, 'current state should not be i');
  equals(statechart.stateIsCurrentState('p'), false, 'current state should not be p');
  equals(statechart.stateIsCurrentState('q'), false, 'current state should not be q');
  equals(statechart.stateIsCurrentState('r'), false, 'current state should not be r');
  equals(statechart.stateIsCurrentState('s'), false, 'current state should not be s');
  
  equals(stateA.getPath('currentSubstates.length'), 3, 'state a should have 3 current substates');
  equals(stateA.stateIsCurrentSubstate('d'), true, 'state a\'s current substate should be state d');
  equals(stateA.stateIsCurrentSubstate('l'), true, 'state a\'s current substate should be state l');
  equals(stateA.stateIsCurrentSubstate('n'), true, 'state a\'s current substate should be state n');
  
  equals(stateC.getPath('currentSubstates.length'), 2, 'state a should have 2 current substates');
  equals(stateC.stateIsCurrentSubstate('l'), true, 'state c\'s current substate should be state l');
  equals(stateC.stateIsCurrentSubstate('n'), true, 'state c\'s current substate should be state n');
  
  equals(stateF.getPath('currentSubstates.length'), 2, 'state f should have 2 current substates');
  equals(stateF.stateIsCurrentSubstate('l'), true, 'state f\'s current substate should be state l');
  equals(stateF.stateIsCurrentSubstate('n'), true, 'state f\'s current substate should be state n');
  
  equals(stateG.getPath('currentSubstates.length'), 0, 'state g should have no current substates');  
});

test("from state l, go to state g", function() {
  var monitor = statechart.get('monitor'),
      stateL = statechart.getState('l'), 
      stateA = statechart.getState('a'),
      stateC = statechart.getState('c'),
      stateF = statechart.getState('f'),
      stateG = statechart.getState('g');
  
  monitor.reset();
  stateL.gotoState('g');
  
  equals(monitor.get('length'), 10, 'initial state sequence should be of length 10');
  equals(monitor.matchSequence()
                .begin()
                .exited('l', 'h', 'n', 'i', 'f')
                .entered('g', 'j', 'p', 'k', 'r')
                .end(), 
         true, 'initial sequence should be exited[l, h, n, i, f], entered[g, j, p, k, r]');
  
  equals(statechart.get('currentStateCount'), 3, 'current state count should be 3');
  equals(statechart.stateIsCurrentState('d'), true, 'current state should be d');
  equals(statechart.stateIsCurrentState('l'), false, 'current state should not be l');
  equals(statechart.stateIsCurrentState('n'), false, 'current state should not be n');
  equals(statechart.stateIsCurrentState('p'), true, 'current state should be p');
  equals(statechart.stateIsCurrentState('r'), true, 'current state should be r');
  
  equals(stateA.getPath('currentSubstates.length'), 3, 'state a should have 3 current substates');
  equals(stateA.stateIsCurrentSubstate('d'), true, 'state a\'s current substate should be state d');
  equals(stateA.stateIsCurrentSubstate('p'), true, 'state a\'s current substate should be state p');
  equals(stateA.stateIsCurrentSubstate('r'), true, 'state a\'s current substate should be state r');
  
  equals(stateC.getPath('currentSubstates.length'), 2, 'state a should have 2 current substates');
  equals(stateC.stateIsCurrentSubstate('p'), true, 'state c\'s current substate should be state p');
  equals(stateC.stateIsCurrentSubstate('r'), true, 'state c\'s current substate should be state r');
  
  equals(stateF.getPath('currentSubstates.length'), 0, 'state f should have no current substates');
  
  equals(stateG.getPath('currentSubstates.length'), 2, 'state g should have 2 current substates');
  equals(stateG.stateIsCurrentSubstate('p'), true, 'state g\'s current substate should be state p');
  equals(stateG.stateIsCurrentSubstate('r'), true, 'state g\'s current substate should be state r');
});

test('from state l, go to state z', function() {
  var monitor = statechart.get('monitor'),
      stateL = statechart.getState('l'), 
      stateA = statechart.getState('a'),
      stateB = statechart.getState('b'),
      stateC = statechart.getState('c'),
      stateF = statechart.getState('f'),
      stateG = statechart.getState('g');
  
  monitor.reset();
  stateL.gotoState('z');
  
  equals(monitor.get('length'), 10, 'initial state sequence should be of length 10');
  equals(monitor.matchSequence()
                .begin()
                .exited('l', 'h', 'n', 'i', 'f', 'c', 'd', 'b', 'a')
                .entered('z')
                .end(), 
         true, 'sequence should be exited[l, h, n, i, f, c, d, b, a], entered[z]');
         
   equals(statechart.get('currentStateCount'), 1, 'current state count should be 1');
   equals(statechart.stateIsCurrentState('z'), true, 'current state should be z');
   equals(statechart.stateIsCurrentState('l'), false, 'current state should not be l');
   equals(statechart.stateIsCurrentState('n'), false, 'current state should not be n');
   equals(statechart.stateIsCurrentState('d'), false, 'current state should not be d');
   
   equals(stateA.getPath('currentSubstates.length'), 0, 'state a should have no current substates');
   equals(stateB.getPath('currentSubstates.length'), 0, 'state b should have no current substates');
   equals(stateC.getPath('currentSubstates.length'), 0, 'state c should have no current substates');
   equals(stateF.getPath('currentSubstates.length'), 0, 'state f should have no current substates');
   equals(stateG.getPath('currentSubstates.length'), 0, 'state g should have no current substates');
});

test('from state l, go to state z, and then go to state s', function() {
  var monitor = statechart.get('monitor'),
      stateL = statechart.getState('l'),
      stateZ = statechart.getState('z'),
      stateS = statechart.getState('s'), 
      stateA = statechart.getState('a'),
      stateB = statechart.getState('b'),
      stateC = statechart.getState('c'),
      stateF = statechart.getState('f'),
      stateG = statechart.getState('g');
  
  stateL.gotoState('z');
  
  monitor.reset();
  stateZ.gotoState('s');
  
  equals(monitor.get('length'), 10, 'initial state sequence should be of length 10');
  equals(monitor.matchSequence()
                .begin()
                .exited('z')
                .entered('a', 'c', 'g', 'k', 's', 'j', 'p', 'b', 'd')
                .end(), 
         true, 'sequence should be exited[z], entered[a, c, g, k, s, j, p, b, d]');
         
   equals(statechart.get('currentStateCount'), 3, 'current state count should be 1');
   equals(statechart.stateIsCurrentState('z'), false, 'current state should not be z');
   equals(statechart.stateIsCurrentState('s'), true, 'current state should be s');
   equals(statechart.stateIsCurrentState('p'), true, 'current state should be p');
   equals(statechart.stateIsCurrentState('d'), true, 'current state should be d');
   
   equals(stateA.getPath('currentSubstates.length'), 3, 'state a should have 3 current substates');
   equals(stateB.getPath('currentSubstates.length'), 1, 'state b should have 1 current substates');
   equals(stateC.getPath('currentSubstates.length'), 2, 'state c should have 2 current substates');
   equals(stateF.getPath('currentSubstates.length'), 0, 'state f should have no current substates');
   equals(stateG.getPath('currentSubstates.length'), 2, 'state g should have 2 current substates');
});