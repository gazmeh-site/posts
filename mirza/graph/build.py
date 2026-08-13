"""Construction of the Mirza LangGraph application.

The graph is a strictly linear chain assembled from ``PIPELINE`` in :mod:`graph.spec`.
Both the node order and the human-in-the-loop ``interrupt_before`` list come from that
single source of truth — change the pipeline there, not here.
"""
from langgraph.checkpoint.memory import MemorySaver
from langgraph.graph import END, START, StateGraph

from .spec import INTERRUPT_NODES, PIPELINE
from .state import ArticleState


def build_app():
    graph = StateGraph(ArticleState)
    for spec in PIPELINE:
        graph.add_node(spec.name, spec.fn)

    # Wire the linear chain: START → node[0] → node[1] → … → END
    prev = START
    for spec in PIPELINE:
        graph.add_edge(prev, spec.name)
        prev = spec.name
    graph.add_edge(prev, END)

    return graph.compile(
        checkpointer=MemorySaver(),
        interrupt_before=list(INTERRUPT_NODES),
    )
