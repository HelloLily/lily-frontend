import React, { Component } from 'react';
import Pagination from 'react-js-pagination';

const DEFAULT_PAGE_SIZE = 20;

class LilyPagination extends Component {
  constructor(props) {
    super(props);

    const pageSize = props.pageSize || DEFAULT_PAGE_SIZE;

    this.state = {
      pageSize,
      page: 1
    };
  }

  handlePageClick = page => {
    this.props.setPage(page).then(() => {
      this.setState({ page });
    });
  };

  render() {
    const { page } = this.state;
    const { pagination } = this.props;
    const { total, numberOfPages } = pagination;
    const pageSize = this.state.pageSize || DEFAULT_PAGE_SIZE;
    const rangeMin = (page - 1) * pageSize;

    // Display the total as the right side of the range indication if we've reached the final items.
    const rangeMax = page === numberOfPages ? total : rangeMin + pageSize;

    return (
      <div className="pagination-container">
        <div>
          Showing {rangeMin} to {rangeMax} of {total} items
        </div>

        {numberOfPages > 1 && (
          <Pagination
            activePage={page}
            itemsCountPerPage={pageSize}
            totalItemsCount={total}
            pageRangeDisplayed={5}
            onChange={this.handlePageClick}
          />
        )}
      </div>
    );
  }
}

export default LilyPagination;
